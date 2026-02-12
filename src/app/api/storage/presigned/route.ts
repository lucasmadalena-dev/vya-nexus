import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDownloadUrl } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ error: "ID do arquivo é obrigatório" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { tenantId: true }
    });

    const file = await prisma.file.findFirst({
      where: { 
        id: fileId,
        tenantId: user?.tenantId
      }
    });

    if (!file) {
      return NextResponse.json({ error: "Arquivo não encontrado ou acesso negado" }, { status: 404 });
    }

    const presignedUrl = await getDownloadUrl(file.key);

    return NextResponse.json({ url: presignedUrl });
  } catch (error: any) {
    console.error("[Presigned URL Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
