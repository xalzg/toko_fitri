export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import StockClient from "./StockClient";

export default async function StockPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return <StockClient initialItems={products} />;
}

