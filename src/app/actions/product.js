"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data) {
  try {
    const { categoryId, name, sku, barcode, purchasePrice, sellingPrice, stock, unit, minimumStock } = data;
    
    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        sku: sku || null,
        barcode: barcode || null,
        purchasePrice: parseFloat(purchasePrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        stock: parseInt(stock) || 0,
        unit: unit || "pcs",
        minimumStock: parseInt(minimumStock) || 5,
        isActive: true,
      }
    });

    if (product.stock > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: "IN",
          quantity: product.stock,
          stockBefore: 0,
          stockAfter: product.stock,
          referenceType: "ADJUSTMENT",
          note: "Stok awal produk baru"
        }
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/stock");
    revalidatePath("/admin/sales/new");
    return { success: true, product };
  } catch (error) {
    console.error("Create Product Error:", error);
    // Simple check for duplicate SKU
    if (error.code === 'P2002') {
      return { success: false, error: "SKU atau Barcode sudah digunakan oleh produk lain." };
    }
    return { success: false, error: "Gagal menyimpan produk. Periksa kembali isian Anda." };
  }
}

export async function updateProduct(id, data) {
  try {
    const { categoryId, name, sku, barcode, purchasePrice, sellingPrice, unit, minimumStock } = data;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        categoryId,
        name,
        sku: sku || null,
        barcode: barcode || null,
        purchasePrice: parseFloat(purchasePrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        unit: unit || "pcs",
        minimumStock: parseInt(minimumStock) || 5,
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/sales/new");
    return { success: true, product };
  } catch (error) {
    console.error("Update Product Error:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "SKU atau Barcode sudah digunakan oleh produk lain." };
    }
    return { success: false, error: "Gagal memperbarui produk" };
  }
}

export async function deleteProduct(id) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/admin/sales/new");
    return { success: true };
  } catch (error) {
    console.error("Delete Product Error:", error);
    return { success: false, error: "Gagal menghapus produk" };
  }
}
