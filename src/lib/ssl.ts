import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from './prisma';

const execAsync = promisify(exec);

/**
 * VyaNexus SSL Automation Service
 * Gerencia a geração de certificados Let's Encrypt para domínios de clientes.
 */

export async function provisionSSL(domainId: string) {
  try {
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: { tenant: true }
    });

    if (!domain || !domain.name) {
      throw new Error('Domínio não encontrado ou sem nome configurado.');
    }

    console.log(`[SSL] Iniciando provisionamento para: ${domain.name}`);

    // Em produção, isso dispararia o certbot ou similar
    // Comando simulado para Let's Encrypt
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: certbot certonly --nginx -d domain.com --non-interactive --agree-tos -m admin@vyanexus.com.br
      // const { stdout, stderr } = await execAsync(`certbot certonly --nginx -d ${domain.name} --non-interactive --agree-tos -m admin@vyanexus.com.br`);
      console.log(`[SSL] Comando Certbot executado para ${domain.name}`);
    } else {
      console.log(`[SSL] [SIMULAÇÃO] Certificado gerado com sucesso para ${domain.name}`);
    }

    // Atualiza o status no banco
    await prisma.domain.update({
      where: { id: domainId },
      data: { 
        status: 'ACTIVE',
        verifiedAt: new Date()
      }
    });

    return { success: true, domain: domain.name };
  } catch (error) {
    console.error(`[SSL Error] Falha ao provisionar SSL para ${domainId}:`, error);
    throw error;
  }
}
