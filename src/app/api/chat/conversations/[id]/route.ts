import prisma from '@/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const conversationId = Number(id)
  const userId = session.user.id

  // Buscar conversa com includes completos
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      client: true,
      agent: true,
      property: true,
    },
  })

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 }
    )
  }

  // Verificar participação na conversa
  if (conversation.clientId !== userId && conversation.agentId !== userId) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  return NextResponse.json(conversation)
}
