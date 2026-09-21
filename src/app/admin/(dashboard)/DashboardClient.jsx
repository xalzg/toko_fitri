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
        <h1 className="text-3xl font-black text-black uppercase">Dashboard & Analisis Keuangan</h1>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-yellow-300 brutal-border brutal-shadow-sm text-black py-2 px-4 focus:outline-none focus:ring-0 font-bold hover:shadow-brutal cursor-pointer transition-all"
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
          icon={<DollarSign className="text-black" size={24} />} 
          trend={`Hari Ini: Rp ${todayOmzet.toLocaleString('id-ID')}`}
          trendPositive={todayOmzet > 0}
          color="bg-green-400"
        />
        <SummaryCard 
          title="Laba Kotor" 
          value={`Rp ${data.labaKotor.toLocaleString('id-ID')}`} 
          icon={<TrendingUp className="text-black" size={24} />} 
          trend={`Omzet - HPP`}
          trendPositive={data.labaKotor > 0}
          color="bg-blue-400"
        />
        <SummaryCard 
          title="Pengeluaran" 
          value={`Rp ${data.totalExpense.toLocaleString('id-ID')}`} 
          icon={<Receipt className="text-black" size={24} />} 
          color="bg-pink-400"
        />
        <SummaryCard 
          title="Estimasi Laba Bersih" 
          value={`Rp ${data.labaBersih.toLocaleString('id-ID')}`} 
          icon={<Activity className="text-black" size={24} />} 
          trend={data.labaBersih >= 0 ? "Profit" : "Rugi"}
          trendPositive={data.labaBersih >= 0}
          color="bg-yellow-400"
        />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="brutal-card p-4 flex items-center bg-purple-300 transition-all hover:translate-y-1 hover:shadow-brutal cursor-pointer">
          <div className="p-3 bg-white brutal-border brutal-shadow-sm mr-4">
            <ShoppingCart className="text-black" size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-black uppercase">Jumlah Transaksi</p>
            <h3 className="text-2xl font-black text-black">{data.totalTransactions}</h3>
          </div>
        </div>
        <div className="brutal-card p-4 flex items-center bg-orange-300 transition-all hover:translate-y-1 hover:shadow-brutal cursor-pointer">
          <div className="p-3 bg-white brutal-border brutal-shadow-sm mr-4">
            <Package className="text-black" size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-black uppercase">Barang Terjual</p>
            <h3 className="text-2xl font-black text-black">{data.totalItemsSold}</h3>
          </div>
        </div>
        <div className="brutal-card p-4 flex items-center bg-cyan-300 transition-all hover:translate-y-1 hover:shadow-brutal cursor-pointer">
          <div className="p-3 bg-white brutal-border brutal-shadow-sm mr-4">
            <Activity className="text-black" size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-black uppercase">Rata-rata Transaksi</p>
            <h3 className="text-xl font-black text-black">Rp {Math.round(data.averageTransaction).toLocaleString('id-ID')}</h3>
          </div>
        </div>
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 brutal-card p-6 bg-white">
          <h2 className="text-xl font-black text-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">Grafik Penjualan 30 Hari Terakhir</h2>
          <div className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                    tickLine={{ stroke: '#000', strokeWidth: 2 }} 
                    tick={{fill: '#000', fontSize: 12, fontWeight: 'bold'}} 
                    dy={10} 
                    minTickGap={15}
                  />
                  <YAxis 
                    axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                    tickLine={{ stroke: '#000', strokeWidth: 2 }} 
                    tick={{fill: '#000', fontSize: 12, fontWeight: 'bold'}} 
                    dx={-10} 
                    tickFormatter={(value) => `Rp ${value / 1000}k`} 
                  />
                  <Tooltip 
                    formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omzet']}
                    contentStyle={{ borderRadius: '0', border: '2px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', backgroundColor: '#fff', color: '#000', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="step" 
                    dataKey="omzet" 
                    stroke="#000" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{r: 8, fill: '#ef4444', strokeWidth: 3, stroke: '#000'}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="brutal-card p-6 flex flex-col bg-white">
          <h2 className="text-xl font-black text-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
            Produk Terlaris
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {data.topProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-black">
                <Package size={48} className="mb-3 opacity-50" />
                <p className="text-sm font-bold">Belum ada data penjualan.</p>
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

function SummaryCard({ title, value, icon, trend, trendPositive, color = "bg-white" }) {
  return (
    <div className={`brutal-card p-5 flex flex-col justify-between ${color} transition-all hover:translate-y-1 hover:shadow-brutal`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs font-black uppercase text-black">{title}</p>
          <h3 className="text-3xl font-black text-black mt-1">{value}</h3>
        </div>
        <div className="p-2 border-2 border-black bg-white rounded-md shadow-brutal-sm">
          {icon}
        </div>
      </div>
      {trend && (
        <p className="text-xs font-black flex items-center p-1.5 border-2 border-black rounded-sm w-fit bg-white text-black mt-2">
          {trendPositive ? <TrendingUp size={16} className="mr-1 text-green-600" /> : <TrendingDown size={16} className="mr-1 text-red-600" />}
          {trend}
        </p>
      )}
    </div>
  );
}

function TopProductItem({ rank, name, qty }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white hover:bg-yellow-100 transition brutal-border brutal-shadow-sm cursor-pointer hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
      <div className="flex items-center space-x-3">
        <span className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-black border-2 border-black shadow-brutal-sm ${
          rank === 1 ? 'bg-yellow-400' : 
          rank === 2 ? 'bg-gray-300' : 
          rank === 3 ? 'bg-orange-400' : 
          'bg-white'
        }`}>
          {rank}
        </span>
        <span className="font-black text-black text-sm truncate max-w-[130px]">{name}</span>
      </div>
      <span className="text-xs font-black text-black bg-pink-300 px-2.5 py-1 brutal-border brutal-shadow-sm">{qty} pcs</span>
    </div>
  );
}
