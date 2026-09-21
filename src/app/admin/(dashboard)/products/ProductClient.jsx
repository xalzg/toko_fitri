"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export default function ProductClient({ initialProducts, categories }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredProducts = initialProducts.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = categoryFilter ? item.categoryId === categoryFilter : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          <Plus size={18} className="mr-2" />
          Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau SKU produk..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga Jual</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada data produk</td></tr>
              ) : filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{item.sku || "-"}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">{item.category?.name}</td>
                  <td className="px-6 py-4">Rp {item.sellingPrice.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.stock > item.minimumStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.isActive ? (
                      <span className="text-green-600 text-xs font-semibold">Aktif</span>
                    ) : (
                      <span className="text-gray-400 text-xs font-semibold">Nonaktif</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 transition"><Edit2 size={16} /></button>
                    <button className="text-red-500 hover:text-red-700 transition"><Trash2 size={16} /></button>
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
