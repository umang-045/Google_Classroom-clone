import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import pool from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions={
     providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"email"},
                password:{label:"Password",type:"password"},

            },
            async authorize(credentials){
                const result=await pool.query("SELECT * FROM users WHERE email =$1",[credentials.email])
                const user=result.rows[0]
                if(!user){
                    throw new Error("Account Not Registered")
                }
                if(!user.password){
                    throw new Error("Incorrect/Invalid Password")
                }
                const isMatch=await bcrypt.compare(credentials.password,user.password)
                if(!isMatch){
                    throw new Error("Incorrect password")
                }
                return {id:user.id,name:user.name,email:user.email}
            }

        })
     ],
     session:{
        strategy:"jwt"
     },
     callbacks:{
        async jwt({token,user}){
            if (user) {token.id=user.id};
            return token
        }
        },
        pages:{
            signIn:"/login"
        },
      secret: process.env.NEXTAUTH_SECRET,
}
const handler =NextAuth(authOptions);
export {handler as GET, handler as POST}