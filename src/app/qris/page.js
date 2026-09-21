import { Store } from "lucide-react";

export default function PublicQRISPage() {
  // In a real scenario, fetch this from the database QrisSetting table.
  const activeQris = {
    merchantName: "Toko Fitri",
    ownerName: "Ibu Fitri",
    // Replace with real URL in production
    imageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=contoh_qris_toko_fitri"
  };

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
        {/* Header */}
        <div className="bg-gray-50 py-6 border-b border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Store className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            {activeQris.merchantName}
          </h1>
          {activeQris.ownerName && (
            <p className="text-gray-500 font-medium text-sm mt-1">{activeQris.ownerName}</p>
          )}
        </div>

        {/* QR Code Area */}
        <div className="p-8 pb-4 flex flex-col items-center justify-center">
          <p className="text-gray-600 font-medium mb-6">
            Scan QRIS untuk melakukan pembayaran
          </p>
          
          <div className="border-4 border-gray-200 rounded-xl p-2 bg-white mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeQris.imageUrl} 
              alt={`QRIS ${activeQris.merchantName}`}
              className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
            />
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS Logo" className="h-8" />
        </div>

        {/* Footer Warning */}
        <div className="bg-red-50 p-4 border-t border-red-100">
          <p className="text-red-700 text-sm font-semibold">
            Pastikan nama merchant sesuai ({activeQris.merchantName}) sebelum melakukan pembayaran.
          </p>
        </div>
      </div>
    </div>
  );
}
