'use client'

import React, { useState, useEffect } from 'react'
import { Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import { ImovelLer } from '@/types/imovel' // Importamos a interface
import { useRouter } from 'next/navigation'

interface ShowImovelProps {
  imovel: ImovelLer // Usamos a interface
}

const ShowImovel: React.FC<ShowImovelProps> = ({ imovel }) => {
  const [favorito, setFavorito] = useState<boolean>(false) // Estado para controlar o favorito
  const router = useRouter()

  // Função para alternar o estado de favorito
  const toggleFavorito = async () => {
    try {
      const response = await fetch('/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imovelId: imovel.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setFavorito(!favorito) // Alternar o estado do favorito após sucesso
      } else {
        console.error('Erro ao atualizar favorito:', data.error)
      }
    } catch (error) {
      console.error('Erro ao favoritar imóvel:', error)
    }
  }

  // Função para verificar se o imóvel já é favoritado
  const verificarFavorito = async () => {
    try {
      const response = await fetch('/api/favoritos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const favoritos = await response.json()

      if (response.ok) {
        const jaFavoritado = favoritos.some(
          (fav: { id: string }) => fav.id === imovel.id
        )
        setFavorito(jaFavoritado) // Define se o imóvel está favoritado
      } else {
        console.error('Erro ao verificar favoritos:', favoritos.error)
      }
    } catch (error) {
      console.error('Erro ao verificar favoritos:', error)
    }
  }

  // Usar useEffect para verificar o estado inicial do favorito (quando o componente for montado)
  useEffect(() => {
    verificarFavorito() // Verifica se o imóvel já é favoritado ao carregar o componente
  }, [imovel.id])

  return (
    <div
      className="w-[342px] h-[275px] rounded-3xl overflow-hidden relative bg-white shadow-lg cursor-pointer"
      onClick={() => router.push(`/imoveis/${imovel.id}`)}
    >
      <div className="relative w-full h-[235px]">
        <Image
          src="/noah.jpg"
          width={342}
          height={235}
          alt="Foto do imóvel"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer z-10"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorito()
          }}
        >
          <Heart
            size={16}
            className={favorito ? 'text-red-500' : 'text-gray-600'}
            fill={favorito ? 'currentColor' : 'none'} // Preenche o coração quando favoritado
          />
        </div>
      </div>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-marrom to-marrom text-white p-4 h-[75px]">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold truncate">{imovel.nome}</h3>
          <h3 className="text-base font-bold truncate">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(imovel.valor)}
          </h3>
        </div>

        <div className="flex items-center text-sm mt-1">
          <MapPin size={16} className="mr-1" />
          <p className="truncate text-xs">
            {imovel.endereco.logradouro +
              ' ' +
              imovel.endereco.numero +
              ', ' +
              imovel.endereco.cidade +
              '-' +
              imovel.endereco.estado}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShowImovel
