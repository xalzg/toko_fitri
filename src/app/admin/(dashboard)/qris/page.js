"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, Store, User } from "lucide-react";
import Image from "next/image";

export default function AdminQRISPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [merchantName, setMerchantName] = useState("Toko Fitri");
  const [ownerName, setOwnerName] = useState("Fitri");
  const [loading, setLoading] = useState(false);
  const [activeQrisUrl, setActiveQrisUrl] = useState(null); // Dummy active state

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    // TODO: Connect to Vercel Blob / Server Action here
    setTimeout(() => {
      setActiveQrisUrl(preview);
      setFile(null);
      setLoading(false);
      alert("QRIS Berhasil diperbarui!");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan QRIS</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulir Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">Update QRIS Toko</h2>
          
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Store size={16} className="mr-2" /> Nama Merchant
              </label>
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User size={16} className="mr-2" /> Nama Pemilik (Opsional)
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar QRIS (JPG/PNG)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none px-2 py-1">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan & Terapkan"}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4 w-full text-center">Preview QRIS Baru</h2>
            {preview ? (
              <div className="relative w-64 h-64 border rounded-xl overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="QRIS Preview" className="object-contain w-full h-full" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                Belum ada gambar yang dipilih
              </div>
            )}
          </div>

          {activeQrisUrl && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
              <CheckCircle className="text-green-600 mt-0.5 mr-3" size={20} />
              <div>
                <h3 className="font-semibold text-green-800">QRIS Aktif!</h3>
                <p className="text-green-700 text-sm mt-1">Pelanggan Anda sekarang dapat melihat QRIS ini di halaman publik.</p>
                <a href="/qris" target="_blank" className="inline-block mt-2 text-sm font-medium text-green-800 underline hover:text-green-900">Lihat Halaman Publik →</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
