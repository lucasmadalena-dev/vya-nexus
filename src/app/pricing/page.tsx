"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const PricingPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = async (planName: string, price: string) => {
    if (!session) {
      router.push('/login'); // Redireciona para login se não estiver autenticado
      return;
    }

    try {
      const response = await fetch('/api/checkout-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planName, price }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url; // Redireciona para o checkout do Asaas
      } else {
        console.error('Erro ao gerar link de checkout:', data.error);
        alert('Ocorreu um erro ao iniciar o checkout. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição de checkout:', error);
      alert('Ocorreu um erro de rede. Verifique sua conexão e tente novamente.');
    }
  };

  const plans = [
    {
      name: 'VyaStart',
      price: 'R$ 29,90',
      frequency: '/mês',
      features: [
        'Acesso Básico ao Dashboard',
        '5 GB de Armazenamento',
        '1 Conta de E-mail',
        'Suporte Padrão',
      ],
      highlight: false,
    },
    {
      name: 'VyaCore - Plano Fundador',
      price: 'R$ 1.497,00',
      frequency: 'Vitalício',
      features: [
        'Acesso Completo ao Dashboard',
        '50 GB de Armazenamento',
        '5 Contas de E-mail',
        'Domínio Personalizado',
        'Suporte Prioritário',
        'Recursos Exclusivos Futuros',
      ],
      highlight: true,
      highlightText: 'OFERTA LIMITADA',
    },
    {
      name: 'VyaForce',
      price: 'R$ 189,90',
      frequency: '/mês',
      features: [
        'Acesso Completo ao Dashboard',
        '20 GB de Armazenamento',
        '3 Contas de E-mail',
        'Domínio Personalizado',
        'Suporte Prioritário',
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-5xl font-extrabold mb-8 text-center leading-tight">
        Escolha o Plano Perfeito para o seu <span className="text-purple-500">VyaNexus</span>
      </h1>
      <p className="text-xl text-gray-400 mb-16 text-center max-w-3xl">
        Impulsione seu negócio com as ferramentas certas. Do essencial ao ilimitado, temos um plano para você.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col border-2 ${plan.highlight ? 'border-purple-500' : 'border-gray-700'}`}
          >
            {plan.highlight && (
              <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                {plan.highlightText}
              </span>
            )}
            <h2 className="text-3xl font-bold mb-4 text-purple-400">{plan.name}</h2>
            <p className="text-5xl font-extrabold mb-2">
              {plan.price}
              <span className="text-xl font-medium text-gray-400">{plan.frequency}</span>
            </p>
            <ul className="flex-grow mb-8 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-300">
                  <CheckCircle className="text-green-400 w-5 h-5 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.name, plan.price)}
              className={`w-full py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${plan.highlight ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
            >
              Assinar Agora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
