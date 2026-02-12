'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Inbox, 
  Send, 
  Star, 
  Trash2, 
  Search, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MailPage() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [emails] = useState([]); // Simulação de Inbox Vazia

  return (
    <div className="flex h-[calc(100-80px)] bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden m-4">
      {/* Sidebar de Pastas */}
      <aside className="w-64 border-r border-gray-50 flex flex-col p-6">
        <button className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all mb-8">
          <Plus className="w-4 h-4" /> Escrever
        </button>

        <nav className="space-y-1 flex-grow">
          <button 
            onClick={() => setActiveFolder('inbox')}
            className={`flex items-center justify-between w-full p-4 rounded-2xl font-bold text-sm transition-all ${activeFolder === 'inbox' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-5 h-5" /> Entrada
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black">0</span>
          </button>
          
          <button className="flex items-center gap-3 w-full p-4 text-gray-500 hover:bg-gray-50 rounded-2xl font-bold text-sm transition-all">
            <Star className="w-5 h-5" /> Favoritos
          </button>
          
          <button className="flex items-center gap-3 w-full p-4 text-gray-500 hover:bg-gray-50 rounded-2xl font-bold text-sm transition-all">
            <Send className="w-5 h-5" /> Enviados
          </button>
          
          <button className="flex items-center gap-3 w-full p-4 text-gray-500 hover:bg-gray-50 rounded-2xl font-bold text-sm transition-all">
            <Trash2 className="w-5 h-5" /> Lixeira
          </button>
        </nav>
      </aside>

      {/* Área de E-mails */}
      <main className="flex-grow flex flex-col">
        {/* Header de Busca e Filtros */}
        <header className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pesquisar e-mails..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Inbox Zero State */}
        <div className="flex-grow flex items-center justify-center p-12">
          {emails.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-sm"
            >
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center text-blue-600">
                  <Sparkles className="w-16 h-16" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Inbox Zero!</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                Você atingiu o nível máximo de foco! Não há e-mails pendentes para você hoje.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Ecossistema em Harmonia
              </div>
            </motion.div>
          ) : (
            <div>Listagem de E-mails</div>
          )}
        </div>
      </main>
    </div>
  );
}
