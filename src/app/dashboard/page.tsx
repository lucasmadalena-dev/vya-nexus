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
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import EcosystemStatus from "@/components/dashboard/EcosystemStatus";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      tenant: {
        include: {
          subscriptions: {
            where: { status: "ACTIVE" },
            include: { plan: true },
            take: 1
          },
          files: { take: 1 },
          domains: { take: 1 }
        }
      }
    }
  });

  if (!user || !user.tenant) {
    redirect("/login");
  }

  const activeSubscription = user.tenant.subscriptions[0];
  const planData = activeSubscription?.plan;
  const features = planData ? JSON.parse(planData.features || '{}') : null;

  // Lógica de Gamificação
  const setupSteps = [
    {
      id: 'storage',
      title: 'VyaDrive Setup',
      description: 'Faça o upload do seu primeiro arquivo.',
      completed: user.tenant.files.length > 0,
      icon: <HardDrive className="w-5 h-5" />
    },
    {
      id: 'email',
      title: 'VyaConnect',
      description: 'Sua caixa de e-mail está ativa.',
      completed: activeSubscription?.status === 'ACTIVE',
      icon: <Mail className="w-5 h-5" />
    },
    {
      id: 'domain',
      title: 'VyaDomain',
      description: 'Aponte seu primeiro domínio.',
      completed: user.tenant.domains.length > 0,
      icon: <Globe className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter text-blue-500">VyaPanel</h1>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 p-4 bg-blue-600 rounded-2xl font-bold transition-all">
            <LayoutDashboard className="w-5 h-5" /> Visão Geral
          </a>
          <a href="/dashboard/drive" className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-2xl font-bold transition-colors">
            <HardDrive className="w-5 h-5" /> VyaDrive
          </a>
          <a href="/dashboard/mail" className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-2xl font-bold transition-colors">
            <Mail className="w-5 h-5" /> Webmail
          </a>
          <a href="#" className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-2xl font-bold transition-colors text-gray-500">
            <Settings className="w-5 h-5" /> Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bem-vindo, {user.name}</h2>
            <p className="text-gray-500 font-medium">Sua infraestrutura de alta performance.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Plano Ativo</p>
              <p className="text-sm font-bold text-blue-600 uppercase">{planData?.name || 'Nenhum'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-600">
              {user.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Gamificação / Setup Status */}
        <EcosystemStatus steps={setupSteps} />

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
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Capacidade Total</p>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <HardDrive className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">NVMe Hosting</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{features?.nvme || '0GB'}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Hospedagem</p>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-full uppercase">E-mails</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{features?.emails || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Contas</p>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-full uppercase">Domínios</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{features?.domains || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Máximo</p>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-3xl font-black mb-4 tracking-tight flex items-center gap-3">
              Potencialize sua Nuvem <Sparkles className="w-8 h-8 text-yellow-400" />
            </h3>
            <p className="text-gray-400 font-medium mb-8">
              Aumente seus limites de storage ou e-mail com nossos add-ons de alta performance.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-2">
              Ver Add-ons <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
