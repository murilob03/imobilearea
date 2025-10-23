import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import bcrypt from 'bcryptjs'
import prisma from '@/db'
import { UserRole } from '@/types'

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        cellphone: { label: 'Cellphone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.cellphone || !credentials?.password) {
          return null
        }

        // Find user by cellphone
        const user = await prisma.user.findUnique({
          where: { cellphone: credentials.cellphone },
          include: { Cliente: true, Imobiliaria: true, Agente: true },
        })

        console.log(user)

        // Validate user and password
        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          return null
        }

        // Return user object with role-specific fields
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          cellphone: user.cellphone,
          //   cpf: role !== UserRole.IMOBILIARIA ? user.cpf : null,
          //   cnpj: role === UserRole.IMOBILIARIA ? user.cnpj : null,
          //   creci: role === UserRole.AGENTE ? user.creci : null,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      // Dynamically copy fields from user to token
      if (user) {
        Object.assign(token, user)
      }
      return token
    },
    async session({ session, token }) {
      // Merge token fields into session.user
      session.user = {
        ...session.user,
        ...token,
        role: token.role as UserRole, // Explicitly cast role to UserRole
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
