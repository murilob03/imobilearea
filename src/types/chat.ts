// Types para o sistema de chat

// TODO: Backend - Adaptar conforme o schema do Prisma
export interface ConversaCriar {
  clientId: string
  agentId: string
  propertyId?: string
}

// Mensagem exatamente como o backend retorna (Prisma)
export interface MessageFromServer {
  id: number
  conversationId: number
  senderId: string
  text: string
  createdAt: string // ISO string vinda da API
}

// Mensagem usada no front-end (com isMine)
export interface ChatMessage {
  id: number
  text: string
  createdAt: string
  isMine: boolean
}

// Objeto usado para enviar mensagem ao backend
export interface MessageSendDTO {
  conversationId: number
  text: string
}

export interface Chat {
  id: number // ID da conversa
  name: string // Nome do outro usuário
  lastMessage: string // Prévia da última mensagem
  time: string // Horário formatado para exibição
  avatar: string // Emoji/avatar gerado pela UI
}
