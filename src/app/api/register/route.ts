import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, affiliateCoupon } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 });
    }

    // 1. Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado' }, { status: 400 });
    }

    // 2. Busca o afiliado pelo cupom se fornecido
    let referredById = null;
    if (affiliateCoupon) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { couponCode: affiliateCoupon }
      });
      if (affiliate) {
        referredById = affiliate.id;
      }
    }

    // 3. Cria o usuário
    // Nota: Em um ambiente real, usaríamos bcrypt para a senha. 
    // Como o schema atual não tem campo 'password' (focado em OAuth), 
    // estamos adaptando para o MVP local.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        manusId: `local_${Date.now()}`, // Placeholder para compatibilidade com o schema
        referredById
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email } 
    });

  } catch (error: any) {
    console.error('[Register Error]:', error);
    return NextResponse.json({ error: 'Erro interno ao criar conta' }, { status: 500 });
  }
}
