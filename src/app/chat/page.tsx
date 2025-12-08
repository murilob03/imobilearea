'use client'

import Footer from '@/components/Footer'
import InputField from '@/components/InputField'
import ChatListItem from '@/components/ChatListItem'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Chat } from '@/types/chat'
import { useSession } from 'next-auth/react'

export default function ChatList() {
  const router = useRouter()
  const { data: session } = useSession()

  const [search, setSearch] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  // Lista de avatares (5 que ciclam)
  const avatars = ['👨🏻', '👩🏻', '🧑🏽', '👨🏼‍💼', '👩🏻‍💼']

  // Buscar conversas do usuário
  async function fetchChats() {
    if (!session?.user?.id) return

    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        console.error('Erro ao buscar conversas')
        return
      }

      const data = await res.json()

      // Formatar retorno do backend → formato esperado pelo ChatListItem
      const formatted: Chat[] = data.map((c: any, index: number) => {
        // Decide quem é o "outro usuário"
        const isClient = c.clientId === session.user.id
        const other = isClient ? c.agent : c.client

        return {
          id: c.id,
          name: other?.name || 'Usuário',
          lastMessage: c.messages?.[0]?.text || 'Sem mensagens ainda',
          time: new Date(c.updatedAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          avatar: avatars[index % avatars.length],
        }
      })

      setChats(formatted)
    } catch (err) {
      console.error('Erro inesperado: ', err)
    } finally {
      setLoading(false)
    }
  }

  // Buscar ao carregar + polling a cada 5s
  useEffect(() => {
    fetchChats()
    const interval = setInterval(fetchChats, 5000)
    return () => clearInterval(interval)
  }, [session])

  // Filtragem local
  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen bg-bege">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-4 pt-14 relative">
        <ArrowLeft
          size={24}
          className="cursor-pointer text-black absolute left-4"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-semibold text-black">Chat</h1>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-600 z-10"
          />
          <InputField
            type="text"
            name="search"
            placeholder="Procure"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 w-[357px] h-[66px] shadow-md"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-auto pb-28">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Carregando conversas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          filtered.map((chat) => (
            <ChatListItem
              key={chat.id}
              id={chat.id}
              name={chat.name}
              lastMessage={chat.lastMessage}
              time={chat.time}
              avatar={chat.avatar}
              onClick={() => router.push(`/chat/${chat.id}`)}
            />
          ))
        )}
      </div>

      <Footer activeState="Chat" />
    </div>
  )
}
