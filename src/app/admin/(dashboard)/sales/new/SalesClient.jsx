"use client";

import { useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingBag, CreditCard, Banknote, UserRound, Tag, Calculator } from "lucide-react";
import { createTransaction } from "@/app/actions/sales";

export default function SalesClient({ initialProducts, initialCustomers }) {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Transaction states
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH, QRIS, KREDIT
  const [customerId, setCustomerId] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [paidInput, setPaidInput] = useState("");
  
  const [loading, setLoading] = useState(false);

  const filteredProducts = initialProducts.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.barcode && item.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Stok Habis");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev; // Limit to stock
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1, price: product.sellingPrice }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty < 1) return item;
        if (newQty > item.stock) return item; // limit to stock
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = parseInt(discountInput) || 0;
  const total = Math.max(0, subtotal - discountAmount);
  
  const paidAmount = parseInt(paidInput) || 0;
  const change = (paymentMethod === "KREDIT" || paidAmount < total) ? 0 : paidAmount - total;

  // Validation
  const isValidCheckout = () => {
    if (cart.length === 0) return false;
    if (paymentMethod === "KREDIT" && !customerId) return false;
    if (paymentMethod !== "KREDIT" && paidAmount < total) return false;
    return true;
  };

  const handleCheckout = async () => {
    if (!isValidCheckout()) return;
    setLoading(true);
    
    const payload = {
      cart,
      paymentMethod,
      customerId: customerId || null,
      discountAmount,
      taxAmount: 0, // Tax 0% for now
      paidAmount: paymentMethod === "KREDIT" ? 0 : paidAmount
    };

    const res = await createTransaction(payload);
    
    if (res.success) {
      alert(`Transaksi Berhasil! \nNo: ${res.transaction.transactionNumber}`);
      // Reset form
      setCart([]);
      setCustomerId("");
      setDiscountInput("");
      setPaidInput("");
      setPaymentMethod("CASH");
    } else {
      alert(`Gagal: ${res.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Product Selection */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Pilih Produk</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk (Nama, SKU, atau Barcode)..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className={`bg-white border rounded-xl p-4 cursor-pointer transition flex flex-col ${product.stock > 0 ? 'border-gray-200 hover:border-blue-500 hover:shadow-md group' : 'border-red-100 opacity-60 cursor-not-allowed'}`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition leading-tight mb-1">{product.name}</h3>
                  <p className={`text-xs mb-3 ${product.stock > 0 ? 'text-gray-500' : 'text-red-500 font-bold'}`}>
                    Stok: {product.stock} {product.unit}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                  <p className="font-bold text-gray-900">Rp {product.sellingPrice.toLocaleString('id-ID')}</p>
                  {product.stock > 0 && (
                    <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div className="w-full lg:w-[450px] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-2 text-blue-600" size={20} />
            Keranjang
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
            {cart.length} Item
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-10">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p>Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-blue-600 font-medium text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 flex items-center justify-center rounded bg-red-50 text-red-500 hover:bg-red-100 ml-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Options */}
        <div className="p-4 border-t border-gray-100 space-y-4 overflow-y-auto">
          {/* Customer Selection */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 flex items-center">
              <UserRound size={14} className="mr-1" /> Pelanggan {paymentMethod === "KREDIT" && <span className="text-red-500 ml-1">* Wajib</span>}
            </label>
            <select 
              value={customerId} 
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Pilih Pelanggan (Umum) --</option>
              {initialCustomers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 flex items-center">
              <CreditCard size={14} className="mr-1" /> Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => { setPaymentMethod("CASH"); setPaidInput(""); }}
                className={`py-2 px-2 flex flex-col items-center justify-center rounded-lg border font-medium text-xs transition ${
                  paymentMethod === "CASH" ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Banknote size={18} className="mb-1" /> Tunai
              </button>
              <button 
                onClick={() => { setPaymentMethod("QRIS"); setPaidInput(""); }}
                className={`py-2 px-2 flex flex-col items-center justify-center rounded-lg border font-medium text-xs transition ${
                  paymentMethod === "QRIS" ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard size={18} className="mb-1" /> QRIS
              </button>
              <button 
                onClick={() => { setPaymentMethod("KREDIT"); setPaidInput(""); }}
                className={`py-2 px-2 flex flex-col items-center justify-center rounded-lg border font-medium text-xs transition ${
                  paymentMethod === "KREDIT" ? "bg-red-50 border-red-600 text-red-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <UserRound size={18} className="mb-1" /> Kasbon
              </button>
            </div>
          </div>

          {/* Discount & Calculations */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-sm font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center">
                <Tag size={12} className="mr-1" /> Diskon (Rp)
              </span>
              <input 
                type="number" 
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="0"
                className="w-24 p-1 text-right text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
              />
            </div>
            
            {paymentMethod !== "KREDIT" && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center">
                  <Calculator size={12} className="mr-1" /> Uang Dibayar
                </span>
                <input 
                  type="number" 
                  value={paidInput}
                  onChange={(e) => setPaidInput(e.target.value)}
                  placeholder="0"
                  className="w-32 p-1 text-right font-medium text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                />
              </div>
            )}
            
            <hr className="border-gray-200 my-2" />
            
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-gray-800">Total Akhir</span>
              <span className="text-xl font-bold text-blue-700">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            {paymentMethod !== "KREDIT" && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-medium text-gray-500">Kembalian</span>
                <span className={`text-sm font-bold ${change > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  Rp {change.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={handleCheckout}
            disabled={!isValidCheckout() || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center mt-2"
          >
            {loading ? "Memproses..." : "Proses Transaksi"}
          </button>
        </div>
      </div>
    </div>
  );
}
