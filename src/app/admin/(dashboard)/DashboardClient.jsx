"use client";

import { useState, useEffect } from "react";
import { Package, ShoppingCart, DollarSign, Activity, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardClient({ initialData }) {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Di aplikasi nyata, mengganti period dropdown memicu server action untuk fetch data baru
  const data = initialData;

  // Chart data didapat langsung dari server action
  const chartData = data.chartData;

  // Mendapatkan data Hari Ini (berada di array terakhir chartData jika period >= 1 hari)
  const todayOmzet = chartData.length > 0 ? chartData[chartData.length - 1].omzet : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard & Analisis Keuangan</h1>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="today">Hari Ini</option>
          <option value="7d">7 Hari Terakhir</option>
          <option value="30d">30 Hari Terakhir</option>
          <option value="month">Bulan Ini</option>
        </select>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard 
          title={`Total Penjualan (${period})`} 
          value={`Rp ${data.totalOmzet.toLocaleString('id-ID')}`} 
          icon={<DollarSign className="text-blue-600" size={24} />} 
          trend={`Hari Ini: Rp ${todayOmzet.toLocaleString('id-ID')}`}
          trendPositive={todayOmzet > 0}
        />
        <SummaryCard 
          title="Laba Kotor" 
          value={`Rp ${data.labaKotor.toLocaleString('id-ID')}`} 
          icon={<TrendingUp className="text-emerald-600" size={24} />} 
          trend={`Omzet - HPP`}
          trendPositive={data.labaKotor > 0}
        />
        <SummaryCard 
          title="Pengeluaran" 
          value={`Rp ${data.totalExpense.toLocaleString('id-ID')}`} 
          icon={<Receipt className="text-rose-600" size={24} />} 
        />
        <SummaryCard 
          title="Estimasi Laba Bersih" 
          value={`Rp ${data.labaBersih.toLocaleString('id-ID')}`} 
          icon={<Activity className={`size-24 ${data.labaBersih >= 0 ? 'text-blue-600' : 'text-rose-600'}`} size={24} />} 
          trend={data.labaBersih >= 0 ? "Profit" : "Rugi"}
          trendPositive={data.labaBersih >= 0}
        />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="p-3 bg-indigo-50 rounded-lg mr-4">
            <ShoppingCart className="text-indigo-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Jumlah Transaksi</p>
            <h3 className="text-xl font-bold text-gray-900">{data.totalTransactions}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="p-3 bg-orange-50 rounded-lg mr-4">
            <Package className="text-orange-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Barang Terjual</p>
            <h3 className="text-xl font-bold text-gray-900">{data.totalItemsSold}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="p-3 bg-teal-50 rounded-lg mr-4">
            <Activity className="text-teal-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Rata-rata Transaksi</p>
            <h3 className="text-xl font-bold text-gray-900">Rp {Math.round(data.averageTransaction).toLocaleString('id-ID')}</h3>
          </div>
        </div>
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Grafik Penjualan 30 Hari Terakhir</h2>
          <div className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11}} 
                    dy={10} 
                    minTickGap={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11}} 
                    dx={-10} 
                    tickFormatter={(value) => `Rp ${value / 1000}k`} 
                  />
                  <Tooltip 
                    formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omzet']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="omzet" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{r: 6, fill: '#2563EB', strokeWidth: 2, stroke: '#fff'}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            Produk Terlaris
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {data.topProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Package size={48} className="mb-3 opacity-20" />
                <p className="text-sm">Belum ada data penjualan.</p>
              </div>
            ) : (
              data.topProducts.map((p, idx) => (
                <TopProductItem key={idx} rank={idx + 1} name={p.name} qty={p.qty} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend, trendPositive }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <p className={`text-xs font-medium flex items-center ${trendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {trend}
        </p>
      )}
    </div>
  );
}

function TopProductItem({ rank, name, qty }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition rounded-lg border border-gray-100">
      <div className="flex items-center space-x-3">
        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm ${
          rank === 1 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
          rank === 2 ? 'bg-gray-200 text-gray-700 border border-gray-300' : 
          rank === 3 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
          'bg-white text-gray-500 border border-gray-200'
        }`}>
          {rank}
        </span>
        <span className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">{name}</span>
      </div>
      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">{qty} pcs</span>
    </div>
  );
}
