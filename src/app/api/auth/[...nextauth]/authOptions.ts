import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserLogin from "@/libs/userLogIn";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await UserLogin(
          credentials.email,
          credentials.password
        );

        console.log("USER FROM LOGIN:", user);
        
        if (user) {
          return user; // ต้องมี name, email
        }

        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      // ตอน login ครั้งแรก
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // เอาข้อมูลจาก token มาใส่ session
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};