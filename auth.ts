// auth.ts

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  providers: [
    Google({
  clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
}),

    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const validPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!validPassword) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        // LOGIN CON GOOGLE
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: user.email!,
            },
          })

          // Si no existe, crear usuario
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: user.name,
                email: user.email!,
                image: user.image,

                onboardingCompleted: false,

                studyHoursGoal: 4,

                academicRiskLevel: "LOW",

                emotionalRiskLevel: "LOW",
              },
            })
          }
        }

        return true
      } catch (error) {
        console.error("SIGNIN ERROR:", error)
        return false
      }
    },

    // IMPORTANTE:
    // NO usar Prisma aquí
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      return token
    },

    // IMPORTANTE:
    // NO usar Prisma aquí
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.image = token.picture as string
      }

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})