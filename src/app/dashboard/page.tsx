import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  LayoutDashboard, 
  HardDrive, 
  Database, 
  Mail, 
  Globe, 
  Settings, 
  ArrowUpRight 
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Busca o usuário com sua assinatura e plano
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      tenant: {
        include: {
          subscriptions: {
            where: { status: "ACTIVE" },
            take: 1
          }
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Tenta identificar o plano atual (baseado na assinatura ativa)
  const activeSubscription = user.tenant?.subscriptions[0];
  
  // Se não houver assinatura ativa, buscamos os dados do plano 'VyaSolo' como fallback ou exibimos 'Nenhum plano ativo'
  const planData = activeSubscription ? await prisma.product.findUnique({
    where: { id: activeSubscription.planId }
  }) : null;

  const features = planData ? JSON.parse(planData.features || '{}') : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Simples */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter text-blue-500">VyaPanel</h1>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 p-4 bg-blue-600 rounded-2xl font-bold">
            <LayoutDashboard className="w-5 h-5" /> Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-2xl font-bold transition-colors">
            <Globe className="w-5 h-5" /> Domínios
          </a>
          <a href="#" className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-2xl font-bold transition-colors">
            <Mail className="w-5 h-5" /> E-mails
          </a>
          <a href="#" className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-2xl font-bold transition-colors">
            <Settings className="w-5 h-5" /> Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bem-vindo, {user.name}</h2>
            <p className="text-gray-500 font-medium">Gerencie sua infraestrutura e produtividade.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Plano Atual</p>
              <p className="text-sm font-bold text-blue-600 uppercase">{planData?.name || 'Sem Plano Ativo'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-600">
              {user.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Plan Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">S3 Storage</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{features?.s3 || '0GB'}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Limite do Plano</p>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <HardDrive className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">NVMe Hosting</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{features?.nvme || '0GB'}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Capacidade</p>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-full uppercase">E-mails</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{features?.emails || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Contas Disponíveis</p>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-full uppercase">Domínios</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{features?.domains || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Mapeados</p>
          </div>
        </div>

        {/* Recent Activity or Upgrade CTA */}
        <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-3xl font-black mb-4 tracking-tight">Escalabilidade Ilimitada</h3>
            <p className="text-gray-400 font-medium mb-8">
              Precisa de mais performance? Adicione blocos extras de storage ou faça upgrade para o plano VyaForce em segundos.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-2">
              Gerenciar Plano <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <Rocket className="w-96 h-96 -rotate-12 translate-x-20 translate-y-20" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Rocket({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.59.79-1.35.73-2.25" />
      <path d="m10 10 5 5-9 9-2-2 6-12Z" />
      <path d="M13 7c2.11-.12 3.11-.11 5.05.1L21 6l-1-1 1-1-1-1-1 1-1-1-1.1 2.95C17.11 5.89 17.12 6.89 17 9l-3 3" />
      <path d="m15 15 2 2" />
      <path d="m17 17 2 2" />
      <path d="m19 19 2 2" />
    </svg>
  );
}
