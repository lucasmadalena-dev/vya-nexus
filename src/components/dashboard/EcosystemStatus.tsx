'use client';

import React from 'react';
import { CheckCircle2, Circle, Sparkles, Rocket, Mail, Globe, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
}

export default function EcosystemStatus({ steps }: { steps: SetupStep[] }) {
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Status do Ecossistema</h3>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm">Complete o setup para desbloquear o potencial máximo.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Nível de Foco</p>
            <p className="text-lg font-black text-blue-600">{progress.toFixed(0)}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeDasharray="100, 100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${progress}, 100` }}
                className="text-blue-600"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-3xl border transition-all ${step.completed ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${step.completed ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 shadow-sm'}`}>
                {step.icon}
              </div>
              {step.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-200" />
              )}
            </div>
            <h4 className={`font-black text-sm uppercase tracking-tight mb-1 ${step.completed ? 'text-green-900' : 'text-gray-900'}`}>
              {step.title}
            </h4>
            <p className={`text-xs font-medium ${step.completed ? 'text-green-700' : 'text-gray-500'}`}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
