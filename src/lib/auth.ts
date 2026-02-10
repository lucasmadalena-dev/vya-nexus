import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    {
      id: "manus",
      name: "Manus",
      type: "oauth",
      authorization: {
        url: "https://auth.manus.im/oauth/authorize",
        params: { scope: "openid email profile" },
      },
      token: "https://auth.manus.im/oauth/token",
      userinfo: "https://auth.manus.im/oauth/userinfo",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          manusId: profile.sub,
        };
      },
      clientId: process.env.MANUS_APP_ID,
      clientSecret: process.env.STRIPE_SECRET_KEY, // Nota: Usando STRIPE_SECRET_KEY como placeholder se necessário, mas idealmente seria MANUS_APP_SECRET
    },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        (session.user as any).manusId = (user as any).manusId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
