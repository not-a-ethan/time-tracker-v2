import { type NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Username and password",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "John Doe" },
            password: { label: "Password", type: "password" }
      },

      async authorize(credentials: any,  req: any): Promise<any> {

      }
    }),
    GithubProvider({
      id: "github",
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ]
};