import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, payment } = body;

    console.log(`[Asaas Webhook] Evento recebido: ${event}`);

    if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
      const asaas_customer_id = payment.customer;
      const amount = payment.value;
      
      // Extrai dados da referência externa se existirem
      let externalData = null;
      try {
        if (payment.externalReference) {
          externalData = JSON.parse(payment.externalReference);
        }
      } catch (e) {
        console.warn('Falha ao processar externalReference no webhook');
      }

      // 1. Encontrar o usuário pelo Customer ID do Asaas
      const user = await prisma.user.findFirst({
        where: { asaas_customer_id },
        include: { 
          affiliate: true,
          // Se o usuário foi indicado por alguém (usando o campo coupon no cadastro)
        }
      });

      if (user) {
        // 2. Ativar Assinatura
        await prisma.subscription.updateMany({
          where: { userId: user.id },
          data: { status: 'ACTIVE' }
        });

        // 3. Lógica de Comissão de Afiliado
        // Buscamos se o usuário tem um cupom vinculado (via externalReference do checkout ou registro)
        const couponCode = externalData?.coupon;
        
        if (couponCode) {
          const affiliate = await prisma.affiliate.findUnique({
            where: { couponCode }
          });

          if (affiliate && affiliate.userId !== user.id) {
            const commissionAmount = amount * 0.30;
            
            // Registra a comissão
            await prisma.commission.create({
              data: {
                affiliateId: affiliate.id,
                amount: commissionAmount,
                description: `Comissão 30% - Venda para ${user.email}`,
                status: 'PENDING'
              }
            });

            // Incrementa o saldo do influenciador
            await prisma.affiliate.update({
              where: { id: affiliate.id },
              data: { balance: { increment: commissionAmount } }
            });

            console.log(`[Comissão] R$ ${commissionAmount.toFixed(2)} creditada para cupom ${couponCode}`);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Asaas Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
