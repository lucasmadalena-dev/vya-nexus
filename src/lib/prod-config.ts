/**
 * VyaNexus Production Configuration Validator
 * Garante que todas as variáveis de ambiente necessárias estejam presentes antes do deploy.
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'ASAAS_API_KEY',
  'ASAAS_API_URL',
  'NEXT_PUBLIC_APP_URL',
  'MANUS_APP_ID',
  'STRIPE_SECRET_KEY' // Usado como placeholder para Manus Secret conforme auth.ts
];

export function validateProductionEnv() {
  const missing = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente faltando para produção:', missing.join(', '));
    return false;
  }
  
  console.log('✅ Todas as variáveis de ambiente de produção estão mapeadas.');
  return true;
}

export const config = {
  isProd: process.env.NODE_ENV === 'production',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  asaas: {
    key: process.env.ASAAS_API_KEY,
    url: process.env.ASAAS_API_URL,
  }
};
