"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";

export default function CategoryClient({ initialCategories }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kategori Produk</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          <Plus size={18} className="mr-2" />
          Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4 text-center">Jumlah Produk</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialCategories.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Tidak ada kategori</td></tr>
              ) : initialCategories.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.id.slice(-6)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {item._count?.products || 0}
                    </span>
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
