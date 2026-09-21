export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import SalesClient from "./SalesClient";

export default async function NewSalesPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  const customers = await prisma.customer.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  return <SalesClient initialProducts={products} initialCustomers={customers} />;
}

