"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/product";

export default function ProductClient({ initialProducts, categories }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    sku: "",
    barcode: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "0",
    minimumStock: "5",
    unit: "pcs"
  });

  const filteredProducts = initialProducts.filter(item => {
    // Only show active products in the list
    if (!item.isActive) return false;
    
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = categoryFilter ? item.categoryId === categoryFilter : true;
    return matchSearch && matchCategory;
  });

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      categoryId: categories.length > 0 ? categories[0].id : "",
      sku: "",
      barcode: "",
      purchasePrice: "",
      sellingPrice: "",
      stock: "0",
      minimumStock: "5",
      unit: "pcs"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      sku: product.sku || "",
      barcode: product.barcode || "",
      purchasePrice: product.purchasePrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stock: product.stock.toString(), // Readonly in edit mode, but passed for UI completeness
      minimumStock: product.minimumStock.toString(),
      unit: product.unit
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus produk ini? (Data akan dinonaktifkan)")) {
      setLoading(true);
      const res = await deleteProduct(id);
      if (!res.success) alert(res.error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (isEditing) {
      const res = await updateProduct(currentId, formData);
      if (res.success) {
        setIsModalOpen(false);
      } else {
        alert(res.error);
      }
    } else {
      const res = await createProduct(formData);
      if (res.success) {
        setIsModalOpen(false);
      } else {
        alert(res.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
        >
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
                <th className="px-6 py-4">Harga Beli</th>
                <th className="px-6 py-4">Harga Jual</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada data produk</td></tr>
              ) : filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.sku || "-"}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">{item.category?.name}</td>
                  <td className="px-6 py-4">Rp {item.purchasePrice.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">Rp {item.sellingPrice.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.stock > item.minimumStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:text-blue-800 transition bg-blue-50 p-1.5 rounded-md hover:bg-blue-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 transition bg-red-50 p-1.5 rounded-md hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama Produk *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kategori *</label>
                  <select 
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Harga Beli (Modal) *</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Harga Jual *</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                  />
                </div>
                
                {!isEditing && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Stok Awal</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Batas Minimum Stok</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({...formData, minimumStock: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">SKU (Opsional)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: KGP-01"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Unit Satuan</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="pcs">Pcs (Satuan)</option>
                    <option value="kg">Kg (Kilogram)</option>
                    <option value="liter">Liter</option>
                    <option value="renceng">Renceng</option>
                    <option value="dus">Dus/Karton</option>
                    <option value="pak">Pak</option>
                  </select>
                </div>
                
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  disabled={loading}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Tambah Produk")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
