"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransaction({
  cart,
  paymentMethod,
  customerId,
  discountAmount = 0,
  taxAmount = 0,
  paidAmount = 0
}) {
  if (!cart || cart.length === 0) {
    return { success: false, error: "Keranjang kosong" };
  }

  if (paymentMethod === "KREDIT" && !customerId) {
    return { success: false, error: "Pelanggan wajib dipilih untuk transaksi KREDIT (Kasbon)" };
  }

  try {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalAmount = subtotal - discountAmount + taxAmount;
    
    // For KREDIT, paidAmount is 0 and change is 0. 
    // For CASH/QRIS, calculate change.
    const finalPaidAmount = paymentMethod === "KREDIT" ? 0 : paidAmount;
    const changeAmount = finalPaidAmount >= totalAmount ? finalPaidAmount - totalAmount : 0;

    if (paymentMethod !== "KREDIT" && finalPaidAmount < totalAmount) {
      return { success: false, error: "Uang dibayar kurang dari total transaksi" };
    }

    const trxNumber = `TRX-${Date.now()}`;

    // Gunakan Prisma transaction (atomic update)
    const result = await prisma.$transaction(async (tx) => {
      
      // Ambil data produk terbaru untuk mendapatkan HPP (purchasePrice) yang valid
      const productIds = cart.map(item => item.id);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } }
      });
      
      const productMap = {};
      dbProducts.forEach(p => {
        productMap[p.id] = p;
      });

      // 1. Buat Transaksi
      const transaction = await tx.transaction.create({
        data: {
          transactionNumber: trxNumber,
          customerId: customerId || null,
          subtotal,
          discountAmount,
          taxAmount,
          totalAmount,
          paidAmount: finalPaidAmount,
          changeAmount,
          paymentMethod,
          status: "COMPLETED",
          // shiftId and userId are null for now until Auth is fully integrated
          items: {
            create: cart.map(item => {
              const dbProduct = productMap[item.id];
              if (!dbProduct) throw new Error(`Produk ${item.name} tidak ditemukan`);
              
              return {
                productId: item.id,
                quantity: item.qty,
                purchasePrice: dbProduct.purchasePrice, // Menyimpan HPP historis!
                sellingPrice: item.price,
                subtotal: item.price * item.qty,
                discountAmount: 0 // Item level discount is 0 for now
              };
            })
          }
        }
      });

      // 2. Update Stok dan Catat Movement untuk setiap barang
      for (const item of cart) {
        const product = productMap[item.id];
        if (product.stock < item.qty) {
          throw new Error(`Stok ${item.name} tidak mencukupi (Sisa: ${product.stock})`);
        }

        const newStock = product.stock - item.qty;

        // Kurangi stok
        await tx.product.update({
          where: { id: item.id },
          data: { stock: newStock }
        });

        // Catat pergerakan stok
        await tx.stockMovement.create({
          data: {
            productId: item.id,
            type: "SALE",
            quantity: item.qty,
            stockBefore: product.stock,
            stockAfter: newStock,
            referenceType: "TRANSACTION",
            referenceId: transaction.id,
            note: `Penjualan ${trxNumber}`
          }
        });
      }

      // 3. Update Utang Pelanggan jika KREDIT
      if (paymentMethod === "KREDIT" && customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            currentDebt: {
              increment: totalAmount
            }
          }
        });
      }

      return transaction;
    });

    revalidatePath("/admin/sales");
    revalidatePath("/admin/stock");
    revalidatePath("/admin"); // Revalidate dashboard

    return { success: true, transaction: result };
  } catch (error) {
    console.error("Transaction Error:", error);
    return { success: false, error: error.message || "Gagal memproses transaksi" };
  }
}
