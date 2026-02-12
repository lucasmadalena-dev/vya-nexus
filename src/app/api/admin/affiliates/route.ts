import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Verificação de Admin (No VyaNexus, apenas o admin principal acessa esta rota)
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

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
