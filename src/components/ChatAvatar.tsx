import React from 'react'

interface ChatAvatarProps {
  avatar: string // TODO: Backend - substituir por URL da imagem do usuário
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function ChatAvatar({ 
  avatar, 
  size = 'medium',
  className = '' 
}: ChatAvatarProps) {
  const sizeClasses = {
    small: 'w-10 h-10 text-2xl',
    medium: 'w-14 h-14 text-3xl',
    large: 'w-16 h-16 text-4xl'
  }

  return (
    <div 
      className={`flex-shrink-0 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {avatar}
    </div>
  )
}
