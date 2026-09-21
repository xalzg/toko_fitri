"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats(period = "30d") {
  try {
    const now = new Date();
    // Normalize to Asia/Jakarta if possible, or simple JS Date adjustment
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    if (period === "7d") {
      startDate.setDate(now.getDate() - 6); // Includes today
    } else if (period === "30d") {
      startDate.setDate(now.getDate() - 29); // Includes today
    } else if (period === "month") {
      startDate.setDate(1);
    }

    // 1. Ambil semua transaksi yang statusnya COMPLETED
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: { gte: startDate },
        status: "COMPLETED"
      },
      include: {
        items: true
      },
      orderBy: { transactionDate: 'asc' }
    });

    // 2. Ambil semua pengeluaran (Expenses) dalam periode yang sama
    const expenses = await prisma.expense.findMany({
      where: {
        expenseDate: { gte: startDate }
      }
    });

    let totalOmzet = 0;
    let totalHpp = 0;
    let totalItemsSold = 0;
    const productSalesMap = {}; // productId -> count

    // Hitung agregasi dasar
    transactions.forEach(trx => {
      totalOmzet += trx.totalAmount;
      trx.items.forEach(item => {
        totalItemsSold += item.quantity;
        totalHpp += (item.purchasePrice * item.quantity); // HPP dinamis dari histori
        productSalesMap[item.productId] = (productSalesMap[item.productId] || 0) + item.quantity;
      });
    });

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const labaKotor = totalOmzet - totalHpp;
    const labaBersih = labaKotor - totalExpense;
    
    const totalTransactions = transactions.length;
    const averageTransaction = totalTransactions > 0 ? totalOmzet / totalTransactions : 0;

    // 3. Bangun data untuk Grafik (Chart)
    // Buat array tanggal yang merepresentasikan setiap hari (untuk 7d atau 30d)
    const chartData = [];
    const daysToGenerate = period === "7d" ? 7 : (period === "30d" ? 30 : 0);
    
    if (daysToGenerate > 0) {
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        // Format label misal "23 Aug"
        const label = d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' });
        
        // Cari total omzet pada tanggal ini
        const dStart = new Date(d);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(d);
        dEnd.setHours(23, 59, 59, 999);
        
        const dailyOmzet = transactions
          .filter(trx => trx.transactionDate >= dStart && trx.transactionDate <= dEnd)
          .reduce((sum, trx) => sum + trx.totalAmount, 0);

        chartData.push({
          name: i === 0 ? "Hari Ini" : label,
          omzet: dailyOmzet
        });
      }
    } else if (period === "today") {
      // Jika today, tampilkan jam saja
      chartData.push({
        name: "Hari Ini",
        omzet: totalOmzet
      });
    } else if (period === "month") {
      // Sama seperti logika harian tapi khusus bulan ini (bisa diperbaiki nanti)
      chartData.push({
        name: "Bulan Ini",
        omzet: totalOmzet
      });
    }

    // 4. Cari Produk Terlaris (Top 5)
    const topProductIds = Object.keys(productSalesMap).sort((a,b) => productSalesMap[b] - productSalesMap[a]).slice(0,5);
    
    let topProducts = [];
    if (topProductIds.length > 0) {
      const topProductsRaw = await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: { id: true, name: true }
      });
      topProducts = topProductsRaw.map(p => ({
        name: p.name,
        qty: productSalesMap[p.id]
      })).sort((a,b) => b.qty - a.qty);
    }

    return {
      success: true,
      data: {
        totalOmzet,
        totalTransactions,
        totalItemsSold,
        averageTransaction,
        totalHpp,
        labaKotor,
        totalExpense,
        labaBersih,
        chartData,
        topProducts
      }
    };

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { success: false, error: "Gagal memuat statistik" };
  }
}
