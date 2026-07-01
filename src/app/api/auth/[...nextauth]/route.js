// pages/api/auth/[...nextauth].js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../model/userModel";
import { connectToDB } from "../../../../utils/database";
import NextAuth from "next-auth/next";
import { generateToken } from "../../../../utils/jwt";
import { cookies } from "next/headers";

export const authOption = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with the provided email.");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Incorrect password.");
          }

          const token = await generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
          });

          cookies().set("access-token", token);
          cookies().set("user_id", user._id);
          cookies().set("name", user.name);
          cookies().set("image", user.image);
          cookies().set("role", user.role);

          // 👇 return role here
          return { 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            role: user.role 
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",  // 🔹 modern NextAuth syntax
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;   // 👈 save role inside token

        token.accessToken = await generateToken({
          id: user.id,
          email: user.email,
          role: user.role,        // 👈 include role in custom JWT
        });
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;     // 👈 attach role to session.user
      session.accessToken = token.accessToken;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
