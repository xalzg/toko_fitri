export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import SalesHistoryClient from "./SalesHistoryClient";

export default async function SalesHistoryPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      _count: {
        select: { items: true }
      }
    },
    orderBy: {
      transactionDate: 'desc'
    },
    take: 100 // MVP limit
  });

  return <SalesHistoryClient initialTransactions={transactions} />;
}

