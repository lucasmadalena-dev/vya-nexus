import fs from "fs";
import path from "path";

/**
 * Utilitário de Provisionamento VyaNexus
 * Simula o armazenamento NVMe de alta performance criando diretórios físicos
 * isolados por tenant_id.
 */

const NVME_BASE_PATH = process.env.NVME_STORAGE_PATH || "/home/ubuntu/vya-nexus/storage/nvme";

export async function provisionTenantStorage(tenantId: string) {
  const tenantPath = path.join(NVME_BASE_PATH, tenantId);

  try {
    if (!fs.existsSync(tenantPath)) {
      fs.mkdirSync(tenantPath, { recursive: true });
      console.log(`[Provisioning] Diretório NVMe criado para o tenant: ${tenantId}`);
      
      // Criar estrutura básica interna
      fs.mkdirSync(path.join(tenantPath, "www"), { recursive: true });
      fs.mkdirSync(path.join(tenantPath, "logs"), { recursive: true });
      fs.mkdirSync(path.join(tenantPath, "backups"), { recursive: true });
      
      return { success: true, path: tenantPath };
    } else {
      console.log(`[Provisioning] Diretório NVMe já existe para o tenant: ${tenantId}`);
      return { success: true, path: tenantPath, exists: true };
    }
  } catch (error) {
    console.error(`[Provisioning Error] Falha ao criar diretório para ${tenantId}:`, error);
    throw new Error("Falha no provisionamento de infraestrutura física.");
  }
}

/**
 * Retorna o uso de disco atual do diretório do tenant (em bytes)
 */
export function getNVMeUsage(tenantId: string): number {
  const tenantPath = path.join(NVME_BASE_PATH, tenantId);
  if (!fs.existsSync(tenantPath)) return 0;

  let totalSize = 0;

  function calculateSize(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  }

  calculateSize(tenantPath);
  return totalSize;
}
