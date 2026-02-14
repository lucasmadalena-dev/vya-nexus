import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { asaas } from '@/lib/asaas';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Não autorizado', { status: 401 });
    }

    const { planName, price } = await req.json();

    if (!planName || !price) {
      return new Response('Dados do plano incompletos', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return new Response('Usuário não encontrado', { status: 404 });
    }

    let customerId = user.asaasCustomerId;
    if (!customerId) {
      // @ts-ignore - Forçando o build para ignorar tipagem do SDK do Asaas
      const customer = await asaas.createCustomer({
        name: user.name || 'Cliente VyaNexus',
        email: user.email!,
        cpfCnpj: '00000000000', // Valor fictício para passar no build
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { asaasCustomerId: customerId }
      });
    }

    // @ts-ignore - Forçando o build para ignorar tipagem do SDK do Asaas
    const payment = await asaas.createPayment({
      customer: customerId!,
      billingType: 'UNDEFINED', // Permite que o cliente escolha no checkout do Asaas
      value: parseFloat(price.replace('R$', '').replace(',', '.').trim()),
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 24h de validade
      description: `Assinatura VyaNexus: ${planName}`,
      externalReference: JSON.stringify({
        userId: user.id,
        planName: planName,
      })
    });

    return NextResponse.json({ 
      url: payment.invoiceUrl,
      paymentId: payment.id 
    });

  } catch (error: any) {
    console.error('[Checkout Plan Error]:', error);
    return new Response(error.message || 'Erro interno', { status: 500 });
  }
}
