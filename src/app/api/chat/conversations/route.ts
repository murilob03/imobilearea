// app/api/chat/conversations/route.ts
import prisma from '@/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/chat/conversations
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ clientId: userId }, { agentId: userId }],
    },
    include: {
      client: true,
      agent: true,
      property: true,
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(conversations)
}

// POST /api/chat/conversations
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agentId, propertyId } = await req.json()

  const clientId = session.user.id // sempre o cliente

  if (!agentId) {
    return NextResponse.json(
      { error: 'agentId é obrigatório' },
      { status: 400 }
    )
  }

  // monta filtro: cliente + agente (propertyId opcional)
  const whereClause: any = { clientId, agentId }

  if (propertyId !== undefined) {
    whereClause.propertyId = propertyId ?? null
  }

  // verifica conversa existente
  const exists = await prisma.conversation.findFirst({
    where: whereClause,
    include: {
      client: true,
      agent: true,
      property: true,
    },
  })

  if (exists) {
    return NextResponse.json(exists)
  }

  // cria conversation nova
  const nova = await prisma.conversation.create({
    data: {
      clientId,
      agentId,
      propertyId,
    },
    include: {
      client: true,
      agent: true,
      property: true,
    },
  })

  return NextResponse.json(nova, { status: 201 })
}
