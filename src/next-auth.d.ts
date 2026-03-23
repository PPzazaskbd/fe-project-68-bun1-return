import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name: string;
      email: string;
      telephone?: string;
      role: string;
      token: string;
      defaultGuestsAdult?: number;
      defaultGuestsChild?: number;
    };
  }

  interface User {
    _id?: string;
    telephone?: string;
    role?: string;
    token?: string;
    defaultGuestsAdult?: number;
    defaultGuestsChild?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    telephone?: string;
    role?: string;
    token?: string;
    defaultGuestsAdult?: number;
    defaultGuestsChild?: number;
  }
}
