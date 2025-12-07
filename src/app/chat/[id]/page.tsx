'use client'

import InputField from '@/components/InputField'
import ChatAvatar from '@/components/ChatAvatar'
import ChatMessage from '@/components/ChatMessage'
import { ArrowLeft, Phone, Video, Send, Plus } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { Message } from '@/types/chat'

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const [msg, setMsg] = useState('')

  // TODO: Backend - Buscar mensagens reais do chat
  // GET /api/chat/[id]/messages - Buscar histórico de mensagens
  // Parâmetro: userId (do params)
  // Retorno: array de { id, senderId, text, timestamp }
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Vi o imóvel anunciado na Rua das Flores. Ainda está disponível?',
      time: '8:30',
      isMine: false
    },
    {
      id: 2,
      text: 'Sim! O imóvel ainda está disponível. Gostaria de agendar uma visita?',
      time: '8:32',
      isMine: true
    },
    {
      id: 3,
      text: 'Perfeito! Quando seria possível visitar?',
      time: '8:35',
      isMine: false
    },
    {
      id: 4,
      text: 'Posso marcar para amanhã às 14h. Funciona para você?',
      time: '8:37',
      isMine: true
    }
  ])

  // TODO: Backend - Buscar dados do destinatário
  // GET /api/user/[id] - Buscar informações do outro usuário
  // Retorno: { id, name, avatar/photoUrl }
  const user = {
    name: 'Jean Lucas',
    avatar: '👨🏽' // TODO: Substituir por URL da foto do usuário
  }

  // TODO: Backend - Enviar mensagem para o servidor
  // POST /api/chat/[id]/messages
  // Body: { receiverId, text, timestamp }
  const handleSend = () => {
    if (msg.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: msg,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isMine: true
        }
      ])
      setMsg('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-bege">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 pt-14">
        <div className="flex items-center gap-3">
          <ArrowLeft
            size={24}
            className="cursor-pointer text-black"
            onClick={() => router.back()}
          />

          <ChatAvatar avatar={user.avatar} size="small" />

          <span className="font-semibold text-black">{user.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <Video size={24} className="cursor-pointer text-black" />
          <Phone size={24} className="cursor-pointer text-black" />
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-auto px-4 py-6">
        {/* Data */}
        <div className="flex justify-center mb-6">
          <span className="text-sm text-gray-700">
            Hoje
          </span>
        </div>

        {/* Lista de mensagens */}
        <div className="space-y-3">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              text={message.text}
              isMine={message.isMine}
            />
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-marrom px-4 py-4 pb-6">
        <div className="flex items-center gap-3">
          <button className="text-white">
            <Plus size={24} />
          </button>

          <InputField
            type="text"
            name="message"
            placeholder=""
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 !bg-white !border-none !rounded-full px-5 py-3"
          />

          <button 
            onClick={handleSend}
            className="text-white"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
