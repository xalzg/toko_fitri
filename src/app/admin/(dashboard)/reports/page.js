import { getDashboardStats } from "@/app/actions/analytics";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const result = await getDashboardStats("month");
  
  const initialData = result.success ? result.data : {
    totalOmzet: 0,
    totalTransactions: 0,
    totalItemsSold: 0,
    averageTransaction: 0,
    topProducts: []
  };

  return <ReportsClient initialData={initialData} />;
}
