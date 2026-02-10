import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Simulação de Venda e Comissão ---');

  // 1. Encontrar o afiliado de teste (PLAYER1)
  const affiliate = await prisma.affiliate.findUnique({
    where: { couponCode: 'PLAYER1' },
    include: { user: true }
  });

  if (!affiliate) {
    console.error('Erro: Afiliado PLAYER1 não encontrado. Rode o script test-affiliate.ts primeiro.');
    return;
  }

  // 2. Criar um cliente fictício que comprou usando o cupom
  const clientEmail = `cliente_${Math.floor(Math.random() * 1000)}@exemplo.com`;
  const client = await prisma.user.create({
    data: {
      email: clientEmail,
      name: 'Cliente de Teste',
      manusId: `manus_client_${Date.now()}`,
      // No mundo real, o vínculo viria do registro ou externalReference do Asaas
    }
  });

  console.log(`Novo cliente criado: ${client.email}`);

  // 3. Simular a confirmação de pagamento (Valor do plano VyaStarter 5: R$ 89.90)
  const saleAmount = 89.90;
  const commissionAmount = saleAmount * 0.30;

  console.log(`Simulando venda de R$ ${saleAmount}...`);

  // 4. Creditar a comissão
  await prisma.commission.create({
    data: {
      affiliateId: affiliate.id,
      amount: commissionAmount,
      description: `Comissão 30% - Venda para ${client.email}`,
      status: 'APPROVED' // Simula liquidação imediata para o teste
    }
  });

  // 5. Atualizar saldo do afiliado
  await prisma.affiliate.update({
    where: { id: affiliate.id },
    data: {
      balance: { increment: commissionAmount }
    }
  });

  console.log('✅ Sucesso!');
  console.log(`Comissão de R$ ${commissionAmount.toFixed(2)} creditada ao afiliado ${affiliate.user.name}.`);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Erro na simulação:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
