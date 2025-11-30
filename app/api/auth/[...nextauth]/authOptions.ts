import { type NextAuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";

import { createAccount } from "@/helpers/project/account/create";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GithubProvider({
      id: "github",
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      const id: number = Number(account?.providerAccountId);
      const name: string = profile?.login;

      return (await createAccount(id, name));
    },
    async session({ session, token, user }) {
      const userId = {
        "userId": token.sub
      };

      const newSession = {...session, ...userId};

      return newSession;
    },
  }
};