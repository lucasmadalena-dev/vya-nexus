import prisma from '@/lib/prisma';
import PricingSection from '@/components/PricingSection';
import Link from 'next/link';

export default async function HomePage() {
  const plans = await prisma.product.findMany({
    where: { category: 'Planos' },
    orderBy: { price: 'asc' }
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Vya <span className="text-blue-500">Nexus</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            A infraestrutura multi-tenant definitiva para quem exige performance, segurança e escalabilidade global.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#pricing" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all">
              Ver Planos
            </Link>
          </div>
        </div>
      </section>

      {/* Vitrine Dinâmica de Planos */}
      <PricingSection plans={plans as any} />
      
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2026 Vya Nexus Cloud Solutions. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
