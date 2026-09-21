"use client";

import { useState } from "react";
import { Search, Eye, Calendar } from "lucide-react";

export default function SalesHistoryClient({ initialTransactions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const filteredTransactions = initialTransactions.filter(trx => {
    const matchSearch = trx.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMethod = methodFilter ? trx.paymentMethod === methodFilter : true;
    return matchSearch && matchMethod;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Penjualan</h1>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
          <Calendar size={18} className="mr-2" />
          Filter Tanggal
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nomor transaksi..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="">Semua Pembayaran</option>
            <option value="CASH">CASH</option>
            <option value="QRIS">QRIS</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">No. Transaksi</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-center">Jumlah Item</th>
                <th className="px-6 py-4">Total Penjualan</th>
                <th className="px-6 py-4">Pembayaran</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada data transaksi</td></tr>
              ) : filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{trx.transactionNumber}</td>
                  <td className="px-6 py-4">{new Date(trx.transactionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {trx._count?.items || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    Rp {trx.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      trx.paymentMethod === "QRIS" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {trx.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-blue-600 transition flex items-center justify-end w-full">
                      <Eye size={18} className="mr-1" /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
