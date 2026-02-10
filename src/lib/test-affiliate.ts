import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Injeção de Afiliado de Teste ---');

  // 1. Criar ou encontrar um usuário para ser o afiliado
  const user = await prisma.user.upsert({
    where: { email: 'affiliate@test.com' },
    update: {},
    create: {
      email: 'affiliate@test.com',
      name: 'Influenciador Teste',
      manusId: 'manus_affiliate_001',
    },
  });

  console.log(`Usuário encontrado/criado: ${user.email}`);

  // 2. Criar o registro de afiliado
  const affiliate = await prisma.affiliate.upsert({
    where: { userId: user.id },
    update: {
      status: 'APPROVED',
      couponCode: 'PLAYER1',
    },
    create: {
      userId: user.id,
      socialMedia: 'https://instagram.com/test_influencer',
      status: 'APPROVED',
      couponCode: 'PLAYER1',
      balance: 0,
    },
  });

  console.log(`Afiliado configurado com sucesso!`);
  console.log(`Cupom: ${affiliate.couponCode}`);
  console.log(`Status: ${affiliate.status}`);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Erro ao injetar afiliado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
