'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  File, 
  UploadCloud, 
  HardDrive, 
  MoreVertical, 
  Download, 
  Trash2, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DrivePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [usage, setUsage] = useState({ usedBytes: 0, limitBytes: 1024 * 1024 * 1024, limitGB: 1 });
  const [uploading, setUploading] = useState(false);

  // Simulação de busca de arquivos (Em produção seria via API)
  useEffect(() => {
    const fetchFiles = async () => {
      // Mock de arquivos para visualização
      setFiles([
        { id: '1', name: 'Relatório_Financeiro.pdf', size: 1024 * 1024 * 2.5, createdAt: new Date() },
        { id: '2', name: 'Backup_Database.sql', size: 1024 * 1024 * 45, createdAt: new Date() },
      ]);
    };
    fetchFiles();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    // Simulação de Upload (Em produção chamaria /api/storage/upload)
    setTimeout(() => {
      const newFiles = acceptedFiles.map(f => ({
        id: Math.random().toString(),
        name: f.name,
        size: f.size,
        createdAt: new Date()
      }));
      setFiles(prev => [...newFiles, ...prev]);
      setUploading(false);
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercent = (usage.usedBytes / usage.limitBytes) * 100;

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">VyaDrive</h2>
          <p className="text-gray-500 font-medium">Armazenamento seguro em nuvem de alta performance.</p>
        </div>
        
        {/* Barra de Progresso de Storage */}
        <div className="w-64 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Uso de Storage</span>
            <span className="text-[10px] font-black text-blue-600 uppercase">{usagePercent.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              className="h-full bg-blue-600"
            />
          </div>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">
            {formatBytes(usage.usedBytes)} de {usage.limitGB}GB utilizados
          </p>
        </div>
      </header>

      {/* Área de Drag & Drop */}
      <div 
        {...getRootProps()} 
        className={`mb-10 border-2 border-dashed rounded-[40px] p-12 text-center transition-all cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-4">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">
            {isDragActive ? 'Solte para fazer o upload' : 'Arraste arquivos ou clique aqui'}
          </h3>
          <p className="text-gray-400 font-medium">
            Upload direto para o VyaCloud S3 (Até 500MB por arquivo)
          </p>
        </div>
      </div>

      {/* Lista de Arquivos */}
      <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pesquisar arquivos..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Nome</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Tamanho</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Data</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {uploading && (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-blue-50/30"
                  >
                    <td colSpan={4} className="px-8 py-4">
                      <div className="flex items-center gap-3 text-blue-600 font-bold text-sm">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Fazendo upload para o VyaCloud...
                      </div>
                    </td>
                  </motion.tr>
                )}
                {files.map((file) => (
                  <motion.tr 
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <File className="w-5 h-5" />
                        </div>
                        <span className="font-black text-gray-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                      {formatBytes(file.size)}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                      {new Date(file.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-400 transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
