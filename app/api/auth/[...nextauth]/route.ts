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
            image: true,
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
          image: user.image,
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

          if (existing) {
            user.id = existing.id.toString()
            await prisma.users.update({
              where: { email: user.email },
              data: { image: user.image }
            });

          } else {
            const created = await prisma.users.create({
              data: {
                name: user.name,
                email: user.email,
                image: user.image
              },
              select: { id: true }
            })
            user.id = created.id.toString()
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
        token.picture = user.image
      } else if (!token.id && token.email) {
        const dbUser = await prisma.users.findUnique({
          where: { email: token.email },
          select: { id: true, image: true },
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
        session.user.image = token.picture
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
