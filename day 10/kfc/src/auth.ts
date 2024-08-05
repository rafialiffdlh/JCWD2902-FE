import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api } from "./config/axios.config";
import { loginSchema } from "./schemas/auth.schema";

export const { signIn, signOut, handlers, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const validateField = loginSchema.safeParse(credentials);
          if (!validateField) throw new Error("Login Gagal");
          const res = await api.get("/users", {
            params: {
              phone_number: credentials?.phone_number,
              password: credentials?.passwird,
            },
          });
          const user = res.data[0];
          delete user.password;
          delete user.confirm_password;
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn() {
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone_number = token.phone_number as string;
        session.user.email = token.email as string;
        session.user.full_name = token.full_name as string;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.full_name = user.full_name;
        token.phone_number = user.phone_number;
        token.email = user.email;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
  },
});
