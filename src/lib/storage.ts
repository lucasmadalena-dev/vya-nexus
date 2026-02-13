import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@/lib/prisma";

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

  const features = JSON.parse(subscription.plan.features || "{}");
  const storageLimitGB = parseInt(features.s3 || "0");
  const storageLimitBytes = storageLimitGB * 1024 * 1024 * 1024;

  const currentUsage = await prisma.file.aggregate({
    where: { tenantId },
    _sum: { size: true }
  });

  const totalUsage = (currentUsage._sum.size || 0) + fileSize;

  if (totalUsage > storageLimitBytes) {
    throw new Error(`Limite de storage excedido. Seu plano permite até ${storageLimitGB}GB.`);
  }

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

export async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET || "vya-nexus-storage",
    Key: key,
  });

  // Expira em 1 hora (3600 segundos)
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function getTenantStorageUsage(tenantId: string) {
  const usage = await prisma.file.aggregate({
    where: { tenantId },
    _sum: { size: true }
  });

  const subscription = await prisma.subscription.findFirst({
    where: { tenantId, status: "ACTIVE" },
    include: { plan: true }
  });

  const features = JSON.parse(subscription?.plan?.features || "{}");
  const limitGB = parseInt(features.s3 || "0");

  return {
    usedBytes: usage._sum.size || 0,
    limitBytes: limitGB * 1024 * 1024 * 1024,
    limitGB
  };
}
