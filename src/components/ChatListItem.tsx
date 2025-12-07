import React from 'react'
import { Check } from 'lucide-react'
import ChatAvatar from './ChatAvatar'

interface ChatListItemProps {
  id: number
  name: string
  lastMessage: string
  time: string
  avatar: string
  onClick: () => void
}

export default function ChatListItem({
  id,
  name,
  lastMessage,
  time,
  avatar,
  onClick
}: ChatListItemProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-marrom_claro transition-colors"
      onClick={onClick}
    >
      {/* Avatar */}
      <ChatAvatar avatar={avatar} size="medium" />

      {/* Informações */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-semibold text-black">
            {name}
          </h3>
          <span className="text-sm text-gray-700 ml-2 flex-shrink-0">
            {time}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Check size={16} className="text-gray-600 flex-shrink-0" />
          <p className="text-sm text-gray-700 truncate">
            {lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
