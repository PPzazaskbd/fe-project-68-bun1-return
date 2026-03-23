import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getUserProfile from "@/libs/getUserProfile";
import { normalizeGuestPreference } from "@/libs/dateRangeParams";
import userLogIn from "@/libs/userLogIn";

function getRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getStringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function readGuestPreference(source: unknown) {
  const record = getRecord(source);

  return normalizeGuestPreference({
    defaultGuestsAdult: record?.defaultGuestsAdult as string | number | null | undefined,
    defaultGuestsChild: record?.defaultGuestsChild as string | number | null | undefined,
  });
}

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
        const userRecord = getRecord(user);
        const userData = getRecord(userRecord?.data);

        if (userRecord?.token && typeof userRecord.token === "string") {
          let profileRecord: Record<string, unknown> | null = null;

          try {
            const profile = await getUserProfile(userRecord.token);
            const resolvedProfile = getRecord(profile);
            profileRecord = getRecord(resolvedProfile?.data) ?? resolvedProfile;
          } catch {
            profileRecord = null;
          }

          const resolvedEmail =
            getStringValue(
              profileRecord?.email,
              userRecord.email,
              userData?.email,
            ) ||
            credentials.email;
          const resolvedRole =
            getStringValue(
              profileRecord?.role,
              userRecord.role,
              userData?.role,
            ) ||
            (resolvedEmail === "admin@example.com" ? "admin" : "user");
          const resolvedId =
            getStringValue(
              profileRecord?._id,
              userRecord._id,
              userData?._id,
            ) || resolvedEmail;
          const resolvedName =
            getStringValue(profileRecord?.name, userRecord.name, userData?.name) ||
            resolvedEmail;
          const guestPreference = readGuestPreference(profileRecord ?? userData ?? userRecord);

          return {
            id: resolvedId,
            name: resolvedName,
            email: resolvedEmail,
            role: resolvedRole,
            token: userRecord.token,
            defaultGuestsAdult: guestPreference.defaultGuestsAdult,
            defaultGuestsChild: guestPreference.defaultGuestsChild,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = (user as any).id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
        token.token = (user as any).token;
        token.defaultGuestsAdult = (user as any).defaultGuestsAdult;
        token.defaultGuestsChild = (user as any).defaultGuestsChild;
      }

      if (trigger === "update") {
        const sessionRecord = getRecord(session);
        const sessionUser = getRecord(sessionRecord?.user);
        const guestPreference = readGuestPreference(sessionUser ?? sessionRecord);

        token.defaultGuestsAdult = guestPreference.defaultGuestsAdult;
        token.defaultGuestsChild = guestPreference.defaultGuestsChild;
      }

      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.token = token.token as string;
      session.user.defaultGuestsAdult = token.defaultGuestsAdult as number | undefined;
      session.user.defaultGuestsChild = token.defaultGuestsChild as number | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
