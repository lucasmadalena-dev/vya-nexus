'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { CreditCard, ShieldCheck, ArrowRight, Loader2, Lock, User, Mail, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedCoupon = localStorage.getItem('vya_affiliate_coupon');
    if (savedCoupon) setCoupon(savedCoupon);
  }, []);

  const handlePayment = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, coupon })
      });

      if (!response.ok) throw new Error('Falha ao processar checkout');

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar o pagamento. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-bold uppercase tracking-widest">Carrinho vazio. Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Revisão de Dados - Asaas</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Finalizar Assinatura</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Dados do Cliente (Novidade solicitada pelo CEO) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl">
              <h2 className="text-lg font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Dados do Pagador
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nome</p>
                  <p className="text-sm font-bold text-gray-900">{session?.user?.name || 'Carregando...'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mail</p>
                  <p className="text-sm font-bold text-gray-900">{session?.user?.email || 'Carregando...'}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total do Plano</p>
                  <p className="text-xl font-black text-blue-700">R$ {cartTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl">
            <h2 className="text-lg font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Resumo do Pedido
            </h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-black text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Assinatura Mensal</p>
                  </div>
                  <p className="text-sm font-black text-gray-900">R$ {item.price.toFixed(2)}</p>
                </div>
              ))}
              
              {coupon && (
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl text-green-700">
                  <span className="text-[10px] font-black uppercase tracking-widest">Cupom Ativo</span>
                  <span className="text-sm font-bold">{coupon}</span>
                </div>
              )}

              <div className="pt-4 flex justify-between items-end">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Geral</span>
                <span className="text-3xl font-black text-gray-900">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Ação de Pagamento */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-900/20">
              <ShieldCheck className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-black mb-4 tracking-tight">Decolagem Autorizada</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-8">
                Os dados acima serão enviados ao **Asaas** para gerar seu link de pagamento seguro.
              </p>
              
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-blue-600/30"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Confirmar e Pagar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
