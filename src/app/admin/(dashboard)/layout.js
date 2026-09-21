import Link from "next/link";
import { LogOut, LayoutDashboard, Package, List, Box, ShoppingCart, FileText, QrCode, Settings } from "lucide-react";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#fdfdfc] font-sans">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white brutal-border brutal-shadow-lg m-4 flex-shrink-0 hidden md:flex flex-col z-10">
        <div className="p-6 border-b-2 border-black bg-yellow-300 rounded-t-sm">
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Toko Fitri</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" color="hover:bg-pink-300" />
          
          <div className="pt-4 pb-2">
            <p className="px-2 text-sm font-black text-black uppercase border-b-2 border-black inline-block">Penjualan</p>
          </div>
          <NavItem href="/admin/sales/new" icon={<ShoppingCart size={20} />} label="Kasir (POS)" color="hover:bg-blue-300" />
          <NavItem href="/admin/sales" icon={<FileText size={20} />} label="Riwayat Penjualan" color="hover:bg-blue-300" />
          
          <div className="pt-4 pb-2">
            <p className="px-2 text-sm font-black text-black uppercase border-b-2 border-black inline-block">Inventory</p>
          </div>
          <NavItem href="/admin/products" icon={<Package size={20} />} label="Produk" color="hover:bg-green-300" />
          <NavItem href="/admin/categories" icon={<List size={20} />} label="Kategori" color="hover:bg-green-300" />
          <NavItem href="/admin/stock" icon={<Box size={20} />} label="Stok" color="hover:bg-green-300" />
          
          <div className="pt-4 pb-2">
            <p className="px-2 text-sm font-black text-black uppercase border-b-2 border-black inline-block">Lainnya</p>
          </div>
          <NavItem href="/admin/reports" icon={<FileText size={20} />} label="Laporan" color="hover:bg-purple-300" />
          <NavItem href="/admin/qris" icon={<QrCode size={20} />} label="QRIS" color="hover:bg-purple-300" />
        </nav>
        
        <div className="p-4 border-t-2 border-black bg-gray-100 rounded-b-sm">
          <button className="flex items-center w-full px-3 py-2 text-black border-2 border-black bg-white hover:bg-red-400 hover:text-black hover:shadow-brutal-sm transition-all font-bold rounded-md">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-yellow-300 border-b-2 border-black shadow-sm md:hidden p-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-black uppercase">Toko Fitri</h1>
          <button className="text-black bg-white border-2 border-black p-1 shadow-brutal-sm"><List size={24} /></button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:py-8 md:pr-8 md:pl-4">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, color = "hover:bg-yellow-300" }) {
  return (
    <Link href={href} className={`flex items-center px-3 py-2.5 text-black border-2 border-transparent hover:border-black rounded-md ${color} hover:shadow-brutal-sm transition-all font-bold`}>
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
