import NextAuth,{AuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import pool from "@/lib/db"
import bcrypt from "bcryptjs"

interface credentialsType{
    email?:string;
    password?:string;
}
interface Users{
    id:string;
    name?:string;
    email?:string;
    password?:string;
}
export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials:  {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },

            },
            async authorize(credentials:credentialsType) {
                const result = await pool.query("SELECT * FROM users WHERE email =$1", [credentials.email])
                const user :Users = result.rows[0]
                if (!user) {
                    throw new Error("Account Not Registered")
                }
                if (!user.password) {
                    throw new Error("Incorrect/Invalid Password")
                }
                const isMatch = await bcrypt.compare(credentials.password, user.password)
                if (!isMatch) {
                    throw new Error("Incorrect password")
                }
                return { id: user.id, name: user.name, email: user.email }
            }

        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider == "google") {
                try {
                    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [user.email])

                    if (existing.rows.length == 0) {
                        await pool.query("INSERT INTO users(name,email,password) VALUES($1,$2, NULL)", [user.name, user.email]);
                    }
                    return true;
                } catch (err) {
                    return false
                }
            }
            else {
                return true
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            };

            if (!token.id) {
                const result = await pool.query("SELECT id FROM users WHERE email=$1", [token.email]);
                token.id = result.rows[0].id;
            }
            return token;
        },
        async session({ session, token }:{session:any,token:any}) {
            if (token) session.user.id = token.id
            return session
        }
    },
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET,
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }