'use client';

import React from 'react';
import { Check, Zap, Shield, Rocket } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string; // JSON string
  category: string;
  image: string;
}

export default function PricingSection({ plans }: { plans: Plan[] }) {
  const { addToCart } = useCart();

  const getIcon = (name: string) => {
    if (name.includes('Solo')) return <Zap className="w-6 h-6 text-blue-500" />;
    if (name.includes('Starter')) return <Rocket className="w-6 h-6 text-blue-600" />;
    return <Shield className="w-6 h-6 text-indigo-600" />;
  };

  // Função para formatar as features do objeto JSON para uma lista legível
  const formatFeatures = (featuresJson: string) => {
    try {
      const parsed = JSON.parse(featuresJson || '{}');
      
      // Se for um array (legado), retorna ele mesmo
      if (Array.isArray(parsed)) return parsed;
      
      // Se for o objeto da nova grade Productivity Suite
      const list = [];
      if (parsed.emails) list.push(`${parsed.emails} ${parsed.emails === 1 ? 'E-mail' : 'E-mails'}`);
      if (parsed.s3) list.push(`${parsed.s3} S3 Storage`);
      if (parsed.domains) list.push(`${parsed.domains} ${parsed.domains === 1 ? 'Domínio' : 'Domínios'}`);
      if (parsed.nvme) list.push(`${parsed.nvme} NVMe Hosting`);
      if (parsed.storage_extra) list.push(`+ ${parsed.storage_extra} Extra`);
      
      return list;
    } catch (e) {
      console.error('Erro ao processar features:', e);
      return [];
    }
  };

  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Productivity Suite</h2>
          <p className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Escolha sua <span className="text-blue-600">Performance</span>
          </p>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Infraestrutura de alta velocidade para desenvolvedores e empresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.filter(p => p.category === 'Planos').map((plan) => {
            const featuresList = formatFeatures(plan.features);
            const isPopular = plan.name.includes('Starter');

            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col p-8 bg-white rounded-3xl border transition-all duration-300 hover:shadow-2xl ${
                  isPopular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-100'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    Mais Popular
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    {getIcon(plan.name)}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{plan.name}</h3>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-sm font-bold text-gray-400 mr-1">R$</span>
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">
                      {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="ml-1 text-gray-400 font-bold text-sm">/mês</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="mb-10 space-y-4 flex-grow">
                  {Array.isArray(featuresList) && featuresList.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700 font-medium">
                      <div className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600 stroke-[3px]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      addToCart(plan);
                      console.log(`Plano ${plan.name} adicionado ao carrinho.`);
                    }}
                    className={`w-full py-4 px-6 rounded-2xl text-white font-black transition-all transform active:scale-95 shadow-lg uppercase tracking-widest text-xs ${
                      isPopular 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' 
                        : 'bg-gray-900 hover:bg-black shadow-gray-500/10'
                    }`}
                  >
                    Assinar Agora
                  </button>
                  <Link 
                    href={`/product/${plan.id}`}
                    className="block w-full text-center py-2 text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                  >
                    Especificações Técnicas
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
