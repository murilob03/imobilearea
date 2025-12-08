// app/api/chat/messages/route.ts
import prisma from '@/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/chat/messages
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { conversationId, text } = await req.json()

  if (!conversationId || !text) {
    return NextResponse.json(
      { error: 'conversationId e text são obrigatórios' },
      { status: 400 }
    )
  }

  const userId = session.user.id

  // verificar se conversa existe e se usuário pertence à conversa
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversa não encontrada' },
      { status: 404 }
    )
  }

  if (conversation.clientId !== userId && conversation.agentId !== userId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  // criar mensagem
  const mensagem = await prisma.message.create({
    data: {
      conversationId,
      senderId: userId,
      text,
    },
    include: {
      sender: true,
    },
  })

  // atualizar updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  })

  return NextResponse.json(mensagem, { status: 201 })
}

// GET /api/chat/messages
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const conversationId = Number(req.nextUrl.searchParams.get('conversationId'))
  const since = req.nextUrl.searchParams.get('since')

  if (!conversationId) {
    return NextResponse.json(
      { error: 'conversationId é obrigatório' },
      { status: 400 }
    )
  }

  // verificar se conversa existe e se usuário participa
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversa não encontrada' },
      { status: 404 }
    )
  }

  if (conversation.clientId !== userId && conversation.agentId !== userId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  // filtro dinâmico
  const where: any = { conversationId }

  if (since) {
    where.createdAt = { gt: new Date(since) }
  }

  // buscar mensagens
  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: {
      sender: true,
    },
  })

  return NextResponse.json(messages)
}
