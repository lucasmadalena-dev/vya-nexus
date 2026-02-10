'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [isAffiliateApplied, setIsAffiliateApplied] = useState(false);

  useEffect(() => {
    // Tenta recuperar o cupom do localStorage na montagem do componente
    const savedCoupon = localStorage.getItem('vya_affiliate_coupon');
    if (savedCoupon) {
      setCoupon(savedCoupon);
      setIsAffiliateApplied(true);
      console.log(`[Cart] Cupom de afiliado recuperado: ${savedCoupon}`);
    }
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md border border-gray-100">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Seu carrinho está vazio</h1>
          <p className="text-gray-500 mb-8">Parece que você ainda não escolheu seu plano de produtividade.</p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-sm">
            Ver Planos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Carrinho</h1>
            <p className="text-gray-500">Revise seu pedido antes de finalizar.</p>
          </div>
          <button 
            onClick={clearCart}
            className="text-sm font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
          >
            Limpar Carrinho
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itens */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="h-24 w-24 bg-gray-900 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-800">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-80" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-black text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">Productivity Suite</p>
                  <p className="text-blue-600 font-black mt-1">
                    R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">x{item.quantity}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
              <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Taxas (Asaas)</span>
                  <span>R$ 0,00</span>
                </div>
                
                {/* Campo de Cupom / Afiliado */}
                <div className="pt-4 border-t border-gray-100">
                  {isAffiliateApplied ? (
                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Afiliado Ativo</p>
                        <p className="text-sm font-bold text-green-800">Cupom Aplicado: {coupon}</p>
                      </div>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('vya_affiliate_coupon');
                          setIsAffiliateApplied(false);
                          setCoupon('');
                        }}
                        className="ml-auto text-xs font-bold text-green-600 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text"
                        placeholder="Cupom de Afiliado"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-gray-900">
                    R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                Finalizar Compra
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <p className="text-center text-xs text-gray-400 px-4">
              Ao finalizar, você concorda com nossos termos de serviço e políticas de recorrência do Asaas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
