import React from 'react'

interface ChatMessageProps {
  text: string
  isMine: boolean
  time?: string // Opcional - pode exibir ou não
}

export default function ChatMessage({ text, isMine, time }: ChatMessageProps) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isMine
            ? 'bg-marrom text-white'
            : 'bg-white text-black border-2 border-black'
        }`}
      >
        <p className="text-sm break-words">{text}</p>
        {time && (
          <span className={`text-xs mt-1 block ${isMine ? 'text-marrom_claro' : 'text-gray-500'}`}>
            {time}
          </span>
        )}
      </div>
    </div>
  )
}
