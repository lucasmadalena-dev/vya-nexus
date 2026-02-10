import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/components/products/AddToCartButton';
import { Cpu, Database, HardDrive, ShieldCheck } from 'lucide-react';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const features = JSON.parse(product.features || '[]');

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
            &larr; Voltar para a vitrine
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Imagem/Preview */}
          <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{product.name}</h2>
              <p className="text-blue-400 font-bold">Performance Tier</p>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-4">
                {product.category}
              </span>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 mb-8 border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Especificações Técnicas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-2 bg-blue-50 rounded-lg mr-4">
                      {idx === 0 && <HardDrive className="w-5 h-5 text-blue-600" />}
                      {idx === 1 && <Database className="w-5 h-5 text-blue-600" />}
                      {idx === 2 && <Cpu className="w-5 h-5 text-blue-600" />}
                      {idx >= 3 && <ShieldCheck className="w-5 h-5 text-blue-600" />}
                    </div>
                    <span className="font-bold text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between p-8 bg-gray-900 rounded-3xl text-white shadow-xl shadow-blue-900/20">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Investimento Mensal</p>
                <span className="text-4xl font-black">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-1/2">
                <AddToCartButton product={product as any} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
