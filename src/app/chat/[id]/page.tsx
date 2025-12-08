'use client'

import InputField from '@/components/InputField'
import ChatAvatar from '@/components/ChatAvatar'
import ChatMessage from '@/components/ChatMessage'
import { ArrowLeft, Phone, Video, Send, Plus } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import {
  ChatMessage as ChatMsgType,
  MessageFromServer,
  MessageSendDTO,
} from '@/types/chat'

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const conversationId = Number(params.id)

  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState<ChatMsgType[]>([])
  const [otherUser, setOtherUser] = useState<any>(null)
  const [meId, setMeId] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll automático
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Função para converter MessageFromServer → ChatMessage
  const transformMessage = (
    m: MessageFromServer,
    myId: string
  ): ChatMsgType => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt,
    isMine: m.senderId === myId,
  })

  // 🧩 Carregar mensagens + dados da conversa
  useEffect(() => {
    async function loadMessages() {
      // pegar histórico
      const res = await fetch(
        `/api/chat/messages?conversationId=${conversationId}`
      )
      const data: MessageFromServer[] = await res.json()

      // pegar meu id
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const myId = session.user.id
      setMeId(myId)

      // buscar dados da conversa
      const convRes = await fetch(`/api/chat/conversations/${conversationId}`)

      const convData = await convRes.json()

      // determinar "outro usuário"
      const theOther =
        convData.clientId === myId ? convData.agent : convData.client

      setOtherUser(theOther)

      // converter mensagens
      const formatted = data.map((m) => transformMessage(m, myId))

      setMessages(formatted)
      scrollToBottom()
    }

    loadMessages()
  }, [conversationId])

  // 🔁 Polling para novas mensagens
  useEffect(() => {
    const interval = setInterval(async () => {
      if (messages.length === 0 || !meId) return

      const lastTimestamp = messages[messages.length - 1].createdAt

      const res = await fetch(
        `/api/chat/messages?conversationId=${conversationId}&since=${lastTimestamp}`
      )

      const news: MessageFromServer[] = await res.json()

      if (news.length > 0) {
        const formatted = news.map((m) => transformMessage(m, meId))
        setMessages((prev) => [...prev, ...formatted])
        scrollToBottom()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [messages, meId, conversationId])

  // 📨 Enviar mensagem real
  async function handleSend() {
    if (!msg.trim()) return
    if (!meId) return

    const payload: MessageSendDTO = {
      conversationId,
      text: msg,
    }

    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const newMsg: MessageFromServer = await res.json()

    // converter mensagem
    const formatted = transformMessage(newMsg, meId)

    setMessages((prev) => [...prev, formatted])
    setMsg('')
    scrollToBottom()
  }

  if (!otherUser) {
    return <div className="text-center p-20">Carregando conversa...</div>
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

          <ChatAvatar avatar={otherUser.avatar ?? '👨🏻‍💼'} size="small" />

          <span className="font-semibold text-black">{otherUser.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <Video size={24} className="cursor-pointer text-black" />
          <Phone size={24} className="cursor-pointer text-black" />
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="space-y-3">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              text={message.text}
              isMine={message.isMine}
            />
          ))}
          <div ref={bottomRef} />
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault() // impede quebra de linha
                handleSend()
              }
            }}
            className="flex-1 !bg-white !border-none !rounded-full px-5 py-3"
          />

          <button onClick={handleSend} className="text-white">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
