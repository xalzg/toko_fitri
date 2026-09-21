import Link from "next/link";
import { LogOut, LayoutDashboard, Package, List, Box, ShoppingCart, FileText, QrCode, Settings } from "lucide-react";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Toko Fitri</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          
          <div className="pt-4 pb-2">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase">Penjualan</p>
          </div>
          <NavItem href="/admin/sales/new" icon={<ShoppingCart size={20} />} label="Transaksi" />
          <NavItem href="/admin/sales" icon={<FileText size={20} />} label="Riwayat Penjualan" />
          
          <div className="pt-4 pb-2">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase">Inventory</p>
          </div>
          <NavItem href="/admin/products" icon={<Package size={20} />} label="Produk" />
          <NavItem href="/admin/categories" icon={<List size={20} />} label="Kategori" />
          <NavItem href="/admin/stock" icon={<Box size={20} />} label="Stok" />
          
          <div className="pt-4 pb-2">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase">Lainnya</p>
          </div>
          <NavItem href="/admin/reports" icon={<FileText size={20} />} label="Laporan" />
          <NavItem href="/admin/qris" icon={<QrCode size={20} />} label="QRIS" />
        </nav>
        
        <div className="p-4 border-t">
          <button className="flex items-center w-full px-2 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (simplified for MVP) */}
        <header className="bg-white shadow-sm md:hidden p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Toko Fitri</h1>
          <button className="text-gray-500"><List size={24} /></button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center px-2 py-2.5 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
