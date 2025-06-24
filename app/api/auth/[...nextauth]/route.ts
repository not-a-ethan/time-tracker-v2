import NextAuth from "next-auth";
import { authOptions } from "./authOpertions";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }