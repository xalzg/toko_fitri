export const dynamic = 'force-dynamic';
import { getDashboardStats } from "@/app/actions/analytics";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  // Default fetch 30d untuk memuat grafik 30 hari secara penuh
  const result = await getDashboardStats("30d");
  
  // Default values if no DB data or error
  const initialData = result.success ? result.data : {
    totalOmzet: 0,
    totalTransactions: 0,
    totalItemsSold: 0,
    averageTransaction: 0,
    totalHpp: 0,
    labaKotor: 0,
    totalExpense: 0,
    labaBersih: 0,
    chartData: [],
    topProducts: []
  };

  return <DashboardClient initialData={initialData} />;
}

