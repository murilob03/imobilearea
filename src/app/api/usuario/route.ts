import { NextResponse } from 'next/server'
import prisma from '@/db'
import { UserCriar, UserLer, UserRole } from '@/types'
import bcrypt from 'bcryptjs'

// Handle GET requests
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    // const role = searchParams.get('role')
    const query = searchParams.get('query')

    // if (!role || !query) {
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameters' },
        { status: 400 }
      )
    }

    const [field, value] = query.split(':')

    if (!field || !value) {
      return NextResponse.json(
        { error: 'Invalid query format, expected "field:value"' },
        { status: 400 }
      )
    }

    const usuarios = await prisma.user.findMany({
      where: {
        [field]: value,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cellphone: true,
        role: true,
        createdAt: true,
      },
    })

    const usuarios_ler: UserLer[] = usuarios.map((usuario) => ({
      ...usuario,
      role: usuario.role as UserRole,
    }))

    return NextResponse.json(usuarios_ler)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Handle POST requests
export async function POST(req: Request) {
  try {
    const dados_usuario: UserCriar = await req.json()
    dados_usuario.password = await bcrypt.hash(dados_usuario.password, 10)

    const dados_comuns = {
      name: dados_usuario.name,
      email: dados_usuario.email,
      cellphone: dados_usuario.cellphone,
      password: dados_usuario.password,
      role: dados_usuario.role,
    }

    let usuario = {}

    try {
      switch (dados_usuario.role) {
        case UserRole.CLIENTE:
          if (!dados_usuario.cpf) {
            return NextResponse.json({ error: 'Missing CPF' }, { status: 400 })
          }

          usuario = await prisma.cliente.create({
            data: {
              user: {
                create: dados_comuns,
              },
              cpf: dados_usuario.cpf,
            },
          })

          break
        case UserRole.IMOBILIARIA:
          if (!dados_usuario.cnpj) {
            return NextResponse.json({ error: 'Missing CNPJ' }, { status: 400 })
          }

          usuario = await prisma.imobiliaria.create({
            data: {
              user: {
                create: dados_comuns,
              },
              cnpj: dados_usuario.cnpj,
            },
          })
          break
        case UserRole.AGENTE:
          if (!dados_usuario.creci || !dados_usuario.cpf) {
            return NextResponse.json(
              { error: 'Missing CRECI or CPF' },
              { status: 400 }
            )
          }

          usuario = await prisma.agente.create({
            data: {
              user: {
                create: dados_comuns,
              },
              cpf: dados_usuario.cpf,
              creci: dados_usuario.creci,
            },
          })
          break
        default:
          return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unexpected error' }, { status: 400 })
    }

    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Handle unsupported HTTP methods
export function HEAD() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'GET, POST' } }
  )
}
