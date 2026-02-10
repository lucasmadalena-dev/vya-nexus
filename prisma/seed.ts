import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.product.deleteMany();

  const plans = [
    {
      name: 'VyaSolo',
      description: 'Essencial para produtividade individual.',
      price: 34.90,
      image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=800&auto=format&fit=crop',
      category: 'Planos',
      stock: 999,
      features: JSON.stringify({
        emails: 1,
        s3: '100GB',
        domains: 1,
        nvme: '15GB'
      })
    },
    {
      name: 'VyaStarter 5',
      description: 'Ideal para pequenos times e projetos em crescimento.',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      category: 'Planos',
      stock: 999,
      features: JSON.stringify({
        emails: 5,
        s3: '250GB',
        domains: 3,
        nvme: '50GB'
      })
    },
    {
      name: 'VyaPro 10',
      description: 'Máxima performance para profissionais e agências.',
      price: 159.90,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      category: 'Planos',
      stock: 999,
      features: JSON.stringify({
        emails: 10,
        s3: '500GB',
        domains: 5,
        nvme: '100GB'
      })
    },
    {
      name: 'Add-on Storage 100GB',
      description: 'Bloco extra de armazenamento S3.',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
      category: 'Add-ons',
      stock: 999,
      features: JSON.stringify({
        storage_extra: '100GB'
      })
    }
  ];

  console.log('Populando nova grade de planos...');
  for (const plan of plans) {
    await prisma.product.create({ data: plan });
  }
  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
