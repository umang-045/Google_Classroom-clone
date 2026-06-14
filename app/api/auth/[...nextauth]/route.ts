import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "../../../../lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
          },
        })

        if (!user) {
          throw new Error("Account Not Registered")
        }

        if (!user.password) {
          throw new Error(
            "Account uses Google Sign-In. Please log in with Google."
          )
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isMatch) {
          throw new Error("Incorrect password")
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],

  session: {
  strategy: "jwt" as const,
},
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false

        try {
          const existing = await prisma.users.findUnique({
            where: { email: user.email },
            select: { id: true },
          })

          if (!existing) {
            await prisma.users.create({
              data: {
                name: user.name,
                email: user.email,
              },
            })
          }

          return true
        } catch (err) {
          console.error("Google sign-in sync error:", err)
          return false
        }
      }

      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      } else if (!token.id && token.email) {
        const dbUser = await prisma.users.findUnique({
          where: { email: token.email },
          select: { id: true },
        })

        if (dbUser) {
          token.id = dbUser.id.toString()
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
