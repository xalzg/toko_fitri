"use client";

import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, Minus, Plus } from "lucide-react";

export default function StockClient({ initialItems }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [items, setItems] = useState(initialItems);

  const getStatus = (stock, min) => {
    if (stock === 0) return { id: "habis", label: "HABIS", color: "bg-red-100 text-red-700 border-red-200", icon: <AlertTriangle size={14} className="mr-1" /> };
    if (stock <= min) return { id: "menipis", label: "MENIPIS", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <AlertTriangle size={14} className="mr-1" /> };
    return { id: "aman", label: "AMAN", color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={14} className="mr-1" /> };
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStatus(item.stock, item.minimumStock);
    const matchStatus = statusFilter ? status.id === statusFilter : true;
    return matchSearch && matchStatus;
  });

  // Mock function for MVP update - actually would call a server action here
  const handleQuickAdjust = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + delta);
        return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Monitoring Stok</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="aman">Aman</option>
            <option value="menipis">Menipis</option>
            <option value="habis">Habis</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-center">Stok / Min</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                 <tr><td colSpan={5} className="text-center py-8 text-gray-500">Tidak ada data produk</td></tr>
              ) : filteredItems.map((item) => {
                const status = getStatus(item.stock, item.minimumStock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">{item.category?.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-gray-800">{item.stock}</span>
                      <span className="text-gray-400 text-xs ml-1">/ {item.minimumStock} {item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleQuickAdjust(item.id, -1)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition">
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-700">{item.stock}</span>
                        <button onClick={() => handleQuickAdjust(item.id, 1)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition">
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
