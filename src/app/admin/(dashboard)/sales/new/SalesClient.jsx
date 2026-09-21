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
      <div className="flex-1 flex flex-col brutal-card overflow-hidden">
        <div className="p-4 border-b-2 border-black bg-blue-300">
          <h2 className="text-xl font-black text-black uppercase mb-4 border-b-2 border-black pb-1 inline-block">Pilih Produk</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
            <input 
              type="text" 
              placeholder="Cari produk (Nama, SKU, atau Barcode)..." 
              className="brutal-input pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className={`brutal-card p-4 cursor-pointer transition-all flex flex-col ${product.stock > 0 ? 'hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-brutal-lg' : 'opacity-60 cursor-not-allowed bg-gray-200'}`}
              >
                <div className="flex-1">
                  <h3 className="font-black text-black leading-tight mb-1">{product.name}</h3>
                  <p className={`text-xs mb-3 font-bold ${product.stock > 0 ? 'text-black' : 'text-red-600'}`}>
                    Stok: {product.stock} {product.unit}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-3 border-t-2 border-black">
                  <p className="font-black text-black">Rp {product.sellingPrice.toLocaleString('id-ID')}</p>
                  {product.stock > 0 && (
                    <button className="w-8 h-8 brutal-border brutal-shadow-sm bg-white flex items-center justify-center hover:bg-green-400 transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none text-black">
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div className="w-full lg:w-[450px] flex flex-col brutal-card overflow-hidden">
        <div className="p-4 border-b-2 border-black bg-green-300 flex items-center justify-between">
          <h2 className="text-xl font-black text-black uppercase flex items-center">
            <ShoppingBag className="mr-2 text-black" size={24} strokeWidth={2.5} />
            Keranjang
          </h2>
          <span className="bg-white border-2 border-black shadow-brutal-sm text-black text-xs font-black px-2.5 py-1">
            {cart.length} Item
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-[200px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-black mt-10">
              <ShoppingBag size={48} strokeWidth={2} className="mb-4 opacity-50" />
              <p className="font-bold">Keranjang masih kosong</p>
            </div>
          ) : (
            <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 brutal-border brutal-shadow-sm bg-white">
                <div className="flex-1 pr-2">
                  <h4 className="font-black text-black text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-black font-bold text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white brutal-btn hover:bg-yellow-300 p-0 text-black">
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <span className="w-6 text-center font-black text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white brutal-btn hover:bg-yellow-300 p-0 text-black">
                    <Plus size={16} strokeWidth={3} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 flex items-center justify-center bg-white brutal-btn hover:bg-red-400 ml-1 p-0 text-black">
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Checkout Options */}
        <div className="p-4 border-t-2 border-black space-y-4 overflow-y-auto bg-[#f8f9fa]">
          {/* Customer Selection */}
          <div>
            <label className="text-xs font-black text-black uppercase mb-1 flex items-center">
              <UserRound size={16} className="mr-1" strokeWidth={3} /> Pelanggan {paymentMethod === "KREDIT" && <span className="text-red-600 ml-1 bg-red-100 px-1 border border-black">* Wajib</span>}
            </label>
            <select 
              value={customerId} 
              onChange={(e) => setCustomerId(e.target.value)}
              className="brutal-input bg-white cursor-pointer"
            >
              <option value="">-- Pilih Pelanggan (Umum) --</option>
              {initialCustomers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="text-xs font-black text-black uppercase mb-1 flex items-center">
              <CreditCard size={16} className="mr-1" strokeWidth={3} /> Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => { setPaymentMethod("CASH"); setPaidInput(""); }}
                className={`py-2 px-2 flex flex-col items-center justify-center brutal-border brutal-shadow-sm font-black text-xs transition-all ${
                  paymentMethod === "CASH" ? "bg-pink-300 translate-x-[2px] translate-y-[2px] shadow-none" : "bg-white hover:bg-pink-100 text-black"
                }`}
              >
                <Banknote size={20} className="mb-1" /> Tunai
              </button>
              <button 
                onClick={() => { setPaymentMethod("QRIS"); setPaidInput(""); }}
                className={`py-2 px-2 flex flex-col items-center justify-center brutal-border brutal-shadow-sm font-black text-xs transition-all ${
                  paymentMethod === "QRIS" ? "bg-cyan-300 translate-x-[2px] translate-y-[2px] shadow-none" : "bg-white hover:bg-cyan-100 text-black"
                }`}
              >
                <CreditCard size={20} className="mb-1" /> QRIS
              </button>
              <button 
                onClick={() => { setPaymentMethod("KREDIT"); setPaidInput(""); }}
                className={`py-2 px-2 flex flex-col items-center justify-center brutal-border brutal-shadow-sm font-black text-xs transition-all ${
                  paymentMethod === "KREDIT" ? "bg-orange-300 translate-x-[2px] translate-y-[2px] shadow-none" : "bg-white hover:bg-orange-100 text-black"
                }`}
              >
                <UserRound size={20} className="mb-1" /> Kasbon
              </button>
            </div>
          </div>

          {/* Discount & Calculations */}
          <div className="bg-white p-3 brutal-border brutal-shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-black">Subtotal</span>
              <span className="text-sm font-black text-black">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-black flex items-center">
                <Tag size={14} className="mr-1" strokeWidth={3} /> Diskon (Rp)
              </span>
              <input 
                type="number" 
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="0"
                className="brutal-input w-28 text-right py-1 px-2"
              />
            </div>
            
            {paymentMethod !== "KREDIT" && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-black flex items-center">
                  <Calculator size={14} className="mr-1" strokeWidth={3} /> Uang Dibayar
                </span>
                <input 
                  type="number" 
                  value={paidInput}
                  onChange={(e) => setPaidInput(e.target.value)}
                  placeholder="0"
                  className="brutal-input w-36 text-right py-1 px-2 font-black text-base"
                />
              </div>
            )}
            
            <hr className="border-t-2 border-black my-2" />
            
            <div className="flex justify-between items-end pt-1">
              <span className="text-sm font-black text-black uppercase">Total Akhir</span>
              <span className="text-2xl font-black text-black bg-yellow-300 px-2 py-1 brutal-border">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            {paymentMethod !== "KREDIT" && (
              <div className="flex justify-between items-center pt-2 mt-1">
                <span className="text-xs font-black text-black uppercase">Kembalian</span>
                <span className={`text-base font-black px-2 py-0.5 border-2 border-black ${change > 0 ? 'bg-green-300 text-black' : 'bg-gray-200 text-black'}`}>
                  Rp {change.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={handleCheckout}
            disabled={!isValidCheckout() || loading}
            className="w-full py-4 bg-blue-400 brutal-btn font-black text-lg flex items-center justify-center mt-2 uppercase tracking-wide"
          >
            {loading ? "Memproses..." : "Proses Transaksi"}
          </button>
        </div>
      </div>
    </div>
  );
}
