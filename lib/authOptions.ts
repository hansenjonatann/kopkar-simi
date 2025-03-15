import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials";
import{ AuthOptions } from "next-auth"
import { compare } from "bcrypt-ts";


const db = new PrismaClient()

export const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username : {type: 'text' , label: 'Username'},
                password: {type:"password" , label: 'Password'}
            },
            async authorize(credentials : any) {
                const user = await db.user.findFirst({
                    where: {username: credentials?.username}
                })

                if(!user) {
                    throw new Error("User not found")
                }

                const isValidPassword = await compare(credentials.password , user.password)

                if (!isValidPassword) {
                    throw new Error("Kata sandi salah");
                  }
          
              return { id: user.id, username: user.username, role: user.role, name: user.name };
            }
        }) 
    ],
    pages: {
      signIn: '/sign-in',
      signOut: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token , user} : any) {
            if(user) {
                token.id = user.id 
                token.username = user.username 
              token.role = user.role
              token.name = user.name
            }
            return token
        },
        async session({session , token} : any) {
            if(token) {
                session.user = {
                    id: token.id ,
                    username: token.username , 
                    role: token.role,
                    name: token.name  
                }
            }
          return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}