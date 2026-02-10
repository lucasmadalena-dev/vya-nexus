import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { affiliateId } = await req.json();

    if (!affiliateId) {
      return NextResponse.json({ error: 'ID do afiliado é obrigatório' }, { status: 400 });
    }

    const updatedAffiliate = await prisma.affiliate.update({
      where: { id: affiliateId },
      data: { status: 'APPROVED' }
    });

    return NextResponse.json({ success: true, affiliate: updatedAffiliate });
  } catch (error) {
    console.error('[Admin Approve Error]:', error);
    return NextResponse.json({ error: 'Erro ao aprovar afiliado' }, { status: 500 });
  }
}
