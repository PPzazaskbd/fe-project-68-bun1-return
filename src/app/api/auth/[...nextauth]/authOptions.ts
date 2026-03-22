import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/libs/userLogIn";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "fallback-secret-key",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await userLogIn(credentials.email, credentials.password);

        if (user && user.token) {
          const resolvedEmail =
            user.email ||
            user.data?.email ||
            credentials.email;
          const resolvedRole =
            user.role ||
            user.data?.role ||
            (resolvedEmail === "admin@example.com" ? "admin" : "user");

          return {
            id: user._id || user.data?._id,
            name: user.name || user.data?.name,
            email: resolvedEmail,
            role: resolvedRole,
            token: user.token,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = (user as any).id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
        token.token = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.token = token.token as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
