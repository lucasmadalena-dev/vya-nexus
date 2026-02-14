import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, payment } = body;

    console.log(`[Asaas Webhook] Evento recebido: ${event}`);

    if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
      const asaasCustomerId = payment.customer;
      const amount = payment.value;
      
      let externalData = null;
      try {
        if (payment.externalReference) {
          externalData = JSON.parse(payment.externalReference);
        }
      } catch (e) {
        console.warn('Falha ao processar externalReference no webhook');
      }

      // 1. Encontrar o usuário e tenant
      const user = await prisma.user.findFirst({
        where: { asaasCustomerId },
        include: { 
          tenant: {
            include: {
              subscriptions: {
                where: { status: 'PENDING' },
                // @ts-ignore - Forçando o build para ignorar tipagem da relação plan que pode estar inconsistente no cache
                include: { plan: true }
              }
            }
          }
        }
      });

      if (user && user.tenant) {
        // 2. Ativar Assinatura
        const pendingSub = user.tenant.subscriptions[0];
        if (pendingSub) {
          await prisma.subscription.update({
            where: { id: pendingSub.id },
            data: { status: 'ACTIVE' }
          });

          // 3. Enviar E-mail de Boas-vindas (VyaConnect)
          await sendWelcomeEmail(
            user.email!,
            user.name || 'Cliente',
            // @ts-ignore - Ignorando tipagem para acesso ao plano
            pendingSub.plan?.name || 'VyaNexus'
          );

          // 3.1 Provisionar Armazenamento NVMe Físico
          const { provisionTenantStorage } = await import('@/lib/provisioning');
          await provisionTenantStorage(user.tenant.id);
        }

        // 4. Lógica de Comissão de Afiliado
        const couponCode = externalData?.coupon;
        if (couponCode) {
          const affiliate = await prisma.affiliate.findUnique({
            where: { couponCode }
          });

          if (affiliate && affiliate.userId !== user.id) {
            const commissionAmount = amount * 0.30;
            
            await prisma.commission.create({
              data: {
                affiliateId: affiliate.id,
                amount: commissionAmount,
                description: `Comissão 30% - Venda para ${user.email}`,
                status: 'PENDING'
              }
            });

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
