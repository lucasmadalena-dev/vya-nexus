import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Perfil do Usuário</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Nome</label>
            <p className="text-lg font-semibold text-gray-900">{user?.name || 'Não informado'}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">E-mail</label>
            <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Manus ID</label>
            <p className="text-lg font-mono text-blue-600 bg-blue-50 p-2 rounded mt-1 break-all">
              {(user as any)?.manusId || 'N/A'}
            </p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}
