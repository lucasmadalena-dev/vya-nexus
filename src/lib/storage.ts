import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToVyaCloud(
  tenantId: string,
  file: Buffer,
  fileName: string,
  fileSize: number
) {
  // 1. Buscar assinatura ativa e limite de storage do tenant
  const subscription = await prisma.subscription.findFirst({
    where: { 
      tenantId,
      status: "ACTIVE" 
    },
    include: {
      plan: true
    }
  });

  if (!subscription || !subscription.plan) {
    throw new Error("Assinatura ativa não encontrada para este tenant.");
  }

  // Extrair limite do JSON de features (ex: "100GB")
  const features = JSON.parse(subscription.plan.features || "{}");
  const storageLimitGB = parseInt(features.s3 || "0");
  const storageLimitBytes = storageLimitGB * 1024 * 1024 * 1024;

  // 2. Calcular uso atual de storage do tenant
  const currentUsage = await prisma.file.aggregate({
    where: { tenantId },
    _sum: { size: true }
  });

  const totalUsage = (currentUsage._sum.size || 0) + fileSize;

  if (totalUsage > storageLimitBytes) {
    throw new Error(`Limite de storage excedido. Seu plano permite até ${storageLimitGB}GB.`);
  }

  // 3. Realizar upload para o S3
  const bucketName = process.env.AWS_S3_BUCKET || "vya-nexus-storage";
  const key = `${tenantId}/${Date.now()}-${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: "application/octet-stream",
    })
  );

  // 4. Registrar arquivo no banco de dados
  const newFile = await prisma.file.create({
    data: {
      name: fileName,
      key: key,
      size: fileSize,
      url: `https://${bucketName}.s3.amazonaws.com/${key}`,
      tenantId: tenantId
    }
  });

  return newFile;
}
