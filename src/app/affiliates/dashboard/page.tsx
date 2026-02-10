import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Copy, 
  ExternalLink, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AffiliateDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Busca dados do afiliado logado
  const affiliate = await prisma.affiliate.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      commissions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  // Proteção de Rota: Apenas aprovados acessam o dashboard completo
  if (!affiliate || affiliate.status !== 'APPROVED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 max-w-md text-center">
          <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Acesso Pendente</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Sua conta de afiliado está em análise pela nossa equipe. Você receberá um e-mail assim que for aprovado para começar a lucrar.
          </p>
          <a href="/" className="inline-block bg-gray-900 text-white font-black py-4 px-8 rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all">
            Voltar para Home
          </a>
        </div>
      </div>
    );
  }

  // Cálculos de métricas
  const totalVendas = affiliate.commissions.length;
  const saldoDisponivel = affiliate.balance;
  const linkAfiliado = `vyanexus.com.br/?ref=${affiliate.couponCode}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Portal do Parceiro</h1>
            <p className="text-gray-500 font-medium tracking-tight">Bem-vindo de volta, <span className="text-blue-600 font-bold">{session.user.name}</span>!</p>
          </div>
          
          {/* Link de Indicação */}
          <div className="bg-blue-600 p-6 rounded-[32px] shadow-2xl shadow-blue-600/20 text-white flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Seu Link de Indicação</p>
            <div className="flex items-center gap-4 bg-blue-700/50 p-3 rounded-2xl border border-blue-400/30">
              <code className="text-sm font-bold tracking-tight">{linkAfiliado}</code>
              <button className="p-2 hover:bg-blue-500 rounded-xl transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 transition-transform hover:scale-[1.02]">
            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total de Vendas</p>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">{totalVendas}</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 transition-transform hover:scale-[1.02]">
            <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Clientes Ativos</p>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">{totalVendas}</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 ring-2 ring-blue-500 ring-opacity-10 transition-transform hover:scale-[1.02]">
            <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Wallet className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Saldo Disponível</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-400">R$</span>
              <p className="text-4xl font-black text-gray-900 tracking-tighter">{saldoDisponivel.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Histórico de Comissões */}
        <div className="bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              Últimas Comissões (30%)
            </h2>
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
              Relatório Completo
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ganho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {affiliate.commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-6 text-sm text-gray-500 font-bold">
                      {new Date(comm.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-gray-900">{comm.description}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Assinatura Productivity Suite</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        Liquidado
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-sm font-black text-blue-600">+ R$ {comm.amount.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
                {affiliate.commissions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aguardando seu primeiro resultado...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
