/**
 * VyaNexus Production Configuration Validator
 * Garante que todas as variáveis de ambiente necessárias estejam presentes e formatadas antes do deploy.
 */

const requiredEnvVars = [
  { name: 'DATABASE_URL', pattern: /^mysql:\/\/.+:.+@.+:\d+\/.+$/ },
  { name: 'NEXTAUTH_SECRET', minLength: 16 },
  { name: 'NEXTAUTH_URL', pattern: /^https?:\/\/.+$/ },
  { name: 'ASAAS_API_KEY', minLength: 32 },
  { name: 'ASAAS_API_URL', pattern: /^https?:\/\/.+$/ },
  { name: 'NEXT_PUBLIC_APP_URL', pattern: /^https?:\/\/.+$/ },
  { name: 'AWS_ACCESS_KEY_ID', minLength: 16 },
  { name: 'AWS_SECRET_ACCESS_KEY', minLength: 32 },
  { name: 'AWS_S3_BUCKET', minLength: 3 },
  { name: 'JWT_SECRET', minLength: 16 },
];

export function validateProductionEnv() {
  const errors: string[] = [];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name];

    if (!value) {
      errors.push(`${envVar.name} está faltando.`);
      continue;
    }

    if (envVar.pattern && !envVar.pattern.test(value)) {
      errors.push(`${envVar.name} possui formato inválido.`);
    }

    if (envVar.minLength && value.length < envVar.minLength) {
      errors.push(`${envVar.name} é muito curto (mínimo ${envVar.minLength} caracteres).`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ ERRO DE INTEGRIDADE: Falha na validação de ambiente:');
    errors.forEach(err => console.error(`   - ${err}`));
    return false;
  }

  console.log('✅ Auditoria de Ambiente: Todas as variáveis obrigatórias estão presentes e válidas.');
  return true;
}

export const config = {
  isProd: process.env.NODE_ENV === 'production',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  asaas: {
    key: process.env.ASAAS_API_KEY,
    url: process.env.ASAAS_API_URL,
  },
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION || 'us-east-1'
  }
};
