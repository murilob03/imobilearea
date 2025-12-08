'use client'

import Image from 'next/image'
import {
  ArrowLeft,
  Bed,
  Briefcase,
  Car,
  MapPin,
  MessageCircle,
  Ruler,
} from 'lucide-react'
import Footer from '@/components/Footer'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ImovelLer } from '@/types/imovel'
import Link from 'next/link'

export default function ImovelPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter() // Hook correto para navegação no cliente
  const [imovel, setImovel] = useState({} as ImovelLer)

  useEffect(() => {
    const fetchImovel = async () => {
      const response = await fetch(`/api/imoveis/?query=id:${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch imovel')
      }

      const data = await response.json()
      setImovel(data[0])
      console.log(data[0])
    }

    fetchImovel()
  }, [params.id])

  if (!imovel.id) {
    return <p>Loading imovel...</p>
  }

  async function iniciarConversa() {
    const res = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: imovel.agenteId, // id do agente
        propertyId: imovel.id, // id do imóvel
      }),
    })

    if (!res.ok) {
      console.error('Erro ao iniciar conversa')
      return
    }

    const conversa = await res.json()

    // conversa.id (se já existia)
    // ou novaConversa.id (se acabou de criar)

    const id = conversa.id ?? conversa.novaConversa?.id

    // redireciona para o chat
    router.push(`/chat/${id}`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-full h-full bg-bege overflow-y-auto relative">
        <div className="relative w-full h-64">
          {/* Imagem */}
          <Image
            src="/noah.jpg"
            alt="Foto do imóvel"
            width={342}
            height={235}
            className="w-full h-full object-cover"
          />
          {/* Botão ArrowLeft reposicionado */}
          <div className="absolute top-4 left-4">
            <button
              className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-70 rounded-full"
              onClick={() => router.back()} // Navega de volta para a página anterior
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex justify-center items-center text-xs rounded-full bg-transparent text-black border border-black w-[108.67px] h-[45px]">
              {imovel.tipo}
            </div>
            <div className="flex justify-center items-center text-xs rounded-full bg-transparent text-black border border-black w-[108.67px] h-[45px]">
              {imovel.tipoOferta}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800 mt-[16px]">
              {imovel.nome}
            </h3>
            <h3 className="text-base font-bold truncate mt-[16px]">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(imovel.valor)}
            </h3>
          </div>
          <div className="mt-4 text-xs space-y-4">
            <p className="flex items-center">
              <MapPin size={16} className="mr-2 " />
              {imovel.endereco.logradouro} {imovel.endereco.numero},{' '}
              {imovel.endereco.cidade} - {imovel.endereco.estado}
            </p>
            <p className="flex items-center">
              <Bed size={16} className="mr-2 " />
              Quartos: {imovel.numQuartos}
            </p>
            <p className="flex items-center">
              <Ruler size={16} className="mr-2 " />
              Área Privativa: {imovel.areaPrivada}m²
            </p>
            <p className="flex items-center">
              <Car size={16} className="mr-2 " />
              Vagas na garagem: {imovel.numVagas}
            </p>
            <div className="flex items-center gap-x-1">
              <Briefcase size={16} className="mr-2" />
              <span>Imobiliária:</span>
              <Link
                href={`/perfil/${imovel.imobiliariaId}`}
                className="text-blue-500"
              >
                {imovel.imobiliaria.user.name}
              </Link>
            </div>
            <label className="block font-bold">
              Agente Imobiliário Responsável
            </label>
            {/* Verificação se o agente imobiliário existe */}
            {imovel.agente ? (
              <button
                onClick={iniciarConversa}
                className="bg-marrom w-[342px] h-[84px] rounded-2xl flex items-center mt-2"
              >
                <div className="flex flex-row gap-3 items-center justify-between w-full">
                  <Image
                    src="/koreano.png"
                    alt="Foto do agente"
                    style={{
                      border: '5px solid #9D6F4D',
                      borderRadius: '50%',
                    }}
                    width={60}
                    height={60}
                    className="ml-2"
                  />

                  <h1 className="text-base">{imovel.agente.user.name}</h1>

                  <MessageCircle size={30} className="mx-2" />
                </div>
              </button>
            ) : (
              <p className="text-gray-600">Não há agente imobiliário.</p>
            )}
          </div>
        </div>
      </div>
      <Footer activeState="Início" />
    </div>
  )
}
