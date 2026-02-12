import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToVyaCloud } from "@/lib/storage";
import { prisma } from "@/lib/prisma";
import path from "path";

/**
 * Sanitiza o nome do arquivo para evitar Path Traversal e caracteres especiais problemáticos.
 */
function sanitizeFileName(fileName: string): string {
  // Remove caminhos e mantém apenas o nome do arquivo
  const baseName = path.basename(fileName);
  // Remove caracteres que não sejam alfanuméricos, pontos, hífens ou underlines
  return baseName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { tenantId: true }
    });

    if (!user?.tenantId) {
      return NextResponse.json({ error: "Tenant não encontrado" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const sanitizedName = sanitizeFileName(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadedFile = await uploadToVyaCloud(
      user.tenantId,
      buffer,
      sanitizedName,
      file.size
    );

    return NextResponse.json(uploadedFile);
  } catch (error: any) {
    console.error("[Storage Upload Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
