"use client";

import { useState } from "react";
import { Download, TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";

export default function ReportsClient({ initialData }) {
  const [reportPeriod, setReportPeriod] = useState("Bulan Ini");

  const data = initialData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Penjualan</h1>
        <div className="flex space-x-3">
          <select 
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Hari Ini</option>
            <option>Minggu Ini</option>
            <option>Bulan Ini</option>
            <option>Tahun Ini</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 pb-6 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">PERIODE LAPORAN</h2>
          <p className="text-xl font-bold text-gray-900">{reportPeriod.toUpperCase()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ReportCard title="Total Omzet" value={`Rp ${data.totalOmzet.toLocaleString('id-ID')}`} icon={<DollarSign className="text-blue-600" size={24} />} />
          <ReportCard title="Total Transaksi" value={data.totalTransactions} icon={<ShoppingCart className="text-purple-600" size={24} />} />
          <ReportCard title="Barang Terjual" value={data.totalItemsSold} icon={<Package className="text-orange-600" size={24} />} />
          <ReportCard title="Rata-rata Transaksi" value={`Rp ${Math.round(data.averageTransaction).toLocaleString('id-ID')}`} icon={<TrendingUp className="text-green-600" size={24} />} />
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
}
