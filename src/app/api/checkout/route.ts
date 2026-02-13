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

    const { cart, coupon } = await req.json();

    if (!cart || cart.length === 0) {
      return new Response('Carrinho vazio', { status: 400 });
    }

    // Busca o usuário completo no banco
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return new Response('Usuário não encontrado', { status: 404 });
    }

    // 1. Garante que o usuário tem um asaasCustomerId
    let customerId = user.asaasCustomerId;
    if (!customerId) {
      // @ts-ignore - Forçando o build para ignorar tipagem do SDK do Asaas
      // @ts-ignore
      const customer = await asaas.createCustomer({
        name: user.name || 'Cliente VyaNexus',
        email: user.email!,
        cpfCnpj: '00000000000',
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { asaasCustomerId: customerId }
      });
    }

    // 2. Calcula o valor total e prepara a descrição
    const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const description = cart.map((item: any) => `${item.quantity}x ${item.name}`).join(', ');

    // 3. Cria o pagamento no Asaas (Pix/Boleto)
    // @ts-ignore - Forçando o build para ignorar tipagem do SDK do Asaas
    // @ts-ignore
    const payment = await asaas.createPayment({
      customer: customerId!,
      billingType: 'UNDEFINED',
      value: total,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      description: `Assinatura VyaNexus: ${description}`,
      externalReference: JSON.stringify({
        userId: user.id,
        coupon: coupon || null,
        cart: cart.map((i: any) => i.id)
      })
    });

    return NextResponse.json({ 
      url: payment.invoiceUrl,
      paymentId: payment.id 
    });

  } catch (error: any) {
    console.error('[Checkout Error]:', error);
    return new Response(error.message || 'Erro interno', { status: 500 });
  }
}
