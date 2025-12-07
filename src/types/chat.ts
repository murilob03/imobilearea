// Types para o sistema de chat

// TODO: Backend - Adaptar conforme o schema do Prisma
export interface Chat {
  id: number
  name: string
  lastMessage: string
  time: string
  avatar: string // TODO: Substituir por photoUrl quando integrar com banco
  // Adicionar quando necessário:
  // userId: string
  // unreadCount?: number
  // isOnline?: boolean
}

export interface Message {
  id: number
  text: string
  time: string
  isMine: boolean
  // TODO: Adicionar quando integrar com banco:
  // senderId: string
  // receiverId: string
  // timestamp: Date
  // status?: 'sent' | 'delivered' | 'read'
}

export interface User {
  id: string
  name: string
  avatar: string // TODO: Substituir por photoUrl
  // Adicionar quando necessário:
  // email?: string
  // isOnline?: boolean
  // lastSeen?: Date
}
