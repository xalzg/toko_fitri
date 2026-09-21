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
        <h1 className="text-3xl font-black text-black uppercase">Daftar Produk</h1>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-400 brutal-btn"
        >
          <Plus size={20} className="mr-2" strokeWidth={3} />
          Tambah Produk
        </button>
      </div>

      <div className="brutal-card overflow-hidden">
        <div className="p-4 border-b-2 border-black flex flex-col sm:flex-row gap-4 justify-between bg-yellow-300">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
            <input 
              type="text" 
              placeholder="Cari nama atau SKU produk..." 
              className="brutal-input pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="brutal-input sm:max-w-xs bg-white cursor-pointer"
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
          <table className="w-full text-left text-sm text-black">
            <thead className="bg-white border-b-2 border-black uppercase font-black">
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
            <tbody className="divide-y-2 divide-black">
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 font-bold text-black">Tidak ada data produk</td></tr>
              ) : filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100 transition-colors bg-white">
                  <td className="px-6 py-4 font-mono font-bold text-black">{item.sku || "-"}</td>
                  <td className="px-6 py-4 font-black text-black">{item.name}</td>
                  <td className="px-6 py-4 font-bold text-black">{item.category?.name}</td>
                  <td className="px-6 py-4 font-bold text-black">Rp {item.purchasePrice.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 font-bold text-black">Rp {item.sellingPrice.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-black border-2 border-black shadow-brutal-sm ${
                      item.stock > item.minimumStock ? 'bg-green-300 text-black' : 'bg-red-400 text-black'
                    }`}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-white hover:bg-blue-300 brutal-border brutal-shadow-sm transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      <Edit2 size={18} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white hover:bg-red-400 brutal-border brutal-shadow-sm transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="brutal-card w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b-2 border-black bg-pink-300">
              <h2 className="text-2xl font-black text-black uppercase">
                {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-black bg-white brutal-border brutal-shadow-sm p-1 hover:bg-red-400 transition-all"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                
                <div className="space-y-1">
                  <label className="text-sm font-black text-black uppercase">Nama Produk *</label>
                  <input 
                    required
                    type="text" 
                    className="brutal-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-black text-black uppercase">Kategori *</label>
                  <select 
                    required
                    className="brutal-input bg-white cursor-pointer"
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
                  <label className="text-sm font-black text-black uppercase">Harga Beli (Modal) *</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    className="brutal-input"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-black text-black uppercase">Harga Jual *</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    className="brutal-input"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                  />
                </div>
                
                {!isEditing && (
                  <div className="space-y-1">
                    <label className="text-sm font-black text-black uppercase">Stok Awal</label>
                    <input 
                      type="number" 
                      min="0"
                      className="brutal-input"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-sm font-black text-black uppercase">Batas Minimum Stok</label>
                  <input 
                    type="number" 
                    min="0"
                    className="brutal-input"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({...formData, minimumStock: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-black text-black uppercase">SKU (Opsional)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: KGP-01"
                    className="brutal-input font-mono"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-black text-black uppercase">Unit Satuan</label>
                  <select 
                    className="brutal-input bg-white cursor-pointer"
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
              
              <div className="flex justify-end space-x-3 pt-6 border-t-2 border-black">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-200 brutal-btn hover:bg-gray-300"
                  disabled={loading}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-400 brutal-btn hover:bg-blue-500 disabled:opacity-50"
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
