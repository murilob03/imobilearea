'use client'

import Footer from '@/components/Footer'
import InputField from '@/components/InputField'
import ChatListItem from '@/components/ChatListItem'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Chat } from '@/types/chat'

export default function ChatList() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  // TODO: Backend - Substituir por fetch de conversas reais
  // GET /api/chat - Buscar todas as conversas do usuário logado
  // Retorno esperado: { userId, userName, userAvatar, lastMessage, timestamp }
  const chats: Chat[] = [
    { 
      id: 1, 
      name: 'Murilo Boccardo', 
      lastMessage: 'Ótimo! Vou verificar a documentação', 
      time: '8:40',
      avatar: '👨🏻'
    },
    { 
      id: 2, 
      name: 'Rodrigo Gidioni', 
      lastMessage: 'Podemos marcar para amanhã?', 
      time: '9:10',
      avatar: '👨🏻‍💼'
    },
    { 
      id: 3, 
      name: 'Julia Shimano', 
      lastMessage: 'Obrigada pela informação!', 
      time: '10:33',
      avatar: '👩🏻'
    },
    { 
      id: 4, 
      name: 'Milena Saito', 
      lastMessage: 'Quanto está o valor do aluguel?', 
      time: '11:15',
      avatar: '👩🏻‍💼'
    },
    { 
      id: 5, 
      name: 'Jean Lucas', 
      lastMessage: 'Sim, combinado', 
      time: '12:00',
      avatar: '👨🏽'
    },
    { 
      id: 6, 
      name: 'Juliana Kawakami', 
      lastMessage: 'Perfeito, até lá!', 
      time: '12:30',
      avatar: '👩🏻‍🦰'
    }
  ]

  const filtered = chats.filter(c =>
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

      {/* Lista de Chats */}
      <div className="flex-1 overflow-auto pb-28">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          filtered.map(chat => (
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
