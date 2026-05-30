import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from "../../../../lib/db"
import bcrypt from "bcryptjs"

interface credentialsType {
    email?: string;
    password?: string;
}
interface UsersData {
    id: string | number;
    name?: string;
    email?: string;
    password?: string;
}
export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },

            },
            async authorize(credentials: credentialsType) {
                const result = await prisma.users.findMany({ where: { email: credentials.email }, select: { id: true, name: true, email: true, password: true } });
                const user: UsersData = result[0]
                if (!user) {
                    throw new Error("Account Not Registered")
                }
                if (!user.password) {
                    throw new Error("Incorrect/Invalid Password")
                }
                if (!credentials.password) {
                    throw new Error("Password is required")
                }
                const isMatch = await bcrypt.compare(credentials.password, user.password)
                if (!isMatch) {
                    throw new Error("Incorrect password")
                }
                return { id: user.id.toString(), name: user.name, email: user.email }
            }

        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider == "google") {
                try {
                    const existing = await prisma.users.findMany({ where: { email: user.email }, select: { id: true, name: true, email: true, password: true } })

                    if (existing.length == 0) {
                        await prisma.users.create({ data: { name: user.name, email: user.email } });
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
                const result = await prisma.users.findUnique({ where: { email: token.email }, select: { id: true } });
                if(result){
                token.id = result?.id;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
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