import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const affiliates = await prisma.affiliate.findMany({
      include: { 
        user: {
          select: {
            name: true,
            email: true
          }
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(affiliates);
  } catch (error) {
    console.error('[Admin Get Affiliates Error]:', error);
    return NextResponse.json({ error: 'Erro ao buscar afiliados' }, { status: 500 });
  }
}
