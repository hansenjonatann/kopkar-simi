import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

// Perluas tipe `Session` untuk menambahkan properti `role`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string; // Tambahkan properti `role`
    } & DefaultSession["user"];
  }
}

// Perluas tipe `JWT` untuk menambahkan properti `role`
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
}
