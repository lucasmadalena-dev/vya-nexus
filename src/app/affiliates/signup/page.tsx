'use client';

import React, { useState } from 'react';

export default function AffiliateSignup() {
  const [formData, setFormData] = useState({
    socialMedia: '',
    couponCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de cadastro via Server Action ou API Route
    alert('Solicitação enviada! Nossa equipe analisará seu perfil.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Portal do Influenciador</h1>
          <p className="text-gray-500 mt-2">Ganhe 30% de comissão recorrente.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">
              Rede Social Principal (URL)
            </label>
            <input
              type="url"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://instagram.com/seu-perfil"
              onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">
              Cupom Desejado
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="EX: LUCAS10"
              onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest"
          >
            Solicitar Acesso
          </button>
        </form>
      </div>
    </div>
  );
}
