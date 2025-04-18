import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    tel: string;
    token: string;
  }

  interface Session {
    user: User; 
  }
}
