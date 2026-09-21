const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Create Owner user
  const owner = await prisma.user.upsert({
    where: { email: 'owner@tokofitri.com' },
    update: { role: 'OWNER' },
    create: {
      email: 'owner@tokofitri.com',
      name: 'Owner Toko Fitri',
      password: hashedPassword,
      role: 'OWNER'
    },
  });
  console.log({ owner });

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tokofitri.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@tokofitri.com',
      name: 'Admin Toko Fitri',
      password: hashedPassword,
      role: 'ADMIN'
    },
  });
  console.log({ admin });

  // Create Kasir user
  const kasir = await prisma.user.upsert({
    where: { email: 'kasir@tokofitri.com' },
    update: { role: 'KASIR' },
    create: {
      email: 'kasir@tokofitri.com',
      name: 'Kasir Toko Fitri',
      password: hashedPassword,
      role: 'KASIR'
    },
  });
  console.log({ kasir });

  // Default Categories
  const categories = ['Sembako', 'Minuman', 'Makanan Ringan', 'Mie Instan', 'Rokok', 'Kebutuhan Rumah Tangga', 'Bumbu Dapur', 'Perlengkapan Mandi', 'Pulsa & Token', 'Lainnya'];
  
  for (const catName of categories) {
    // Only create if not exists (to avoid duplicate on multiple seeds)
    const existingCat = await prisma.category.findFirst({
      where: { name: catName }
    });
    
    if (!existingCat) {
      const cat = await prisma.category.create({
        data: { name: catName }
      });
      console.log(`Created category: ${cat.name}`);
    }
  }

  // Default Expense Categories
  const expenseCategories = ['Listrik', 'Gaji Karyawan', 'Sewa Tempat', 'Kebersihan', 'Lain-lain'];
  
  for (const expCatName of expenseCategories) {
    const existingExpCat = await prisma.expenseCategory.findFirst({
      where: { name: expCatName }
    });
    
    if (!existingExpCat) {
      const expCat = await prisma.expenseCategory.create({
        data: { name: expCatName }
      });
      console.log(`Created expense category: ${expCat.name}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
