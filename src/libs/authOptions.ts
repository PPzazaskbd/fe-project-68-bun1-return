import Credentials from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

import userLogIn from "@/libs/userLogIn";
import getUserProfile from "@/libs/getUserProfile";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await userLogIn(
          credentials.email,
          credentials.password
        );

        const profile = await getUserProfile(res.token);

        return {
          id: profile.data._id,
          name: profile.data.name,
          email: profile.data.email,
          accessToken: res.token,
        } as any; // 👈 กัน TS งอแงก่อน
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | any }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.user = {
        name: token.name,
        email: token.email,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};