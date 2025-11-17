'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'
import EditImovel from '@/components/EditImovel'
import CustomButton from '@/components/CustomButton'
import { useSession } from 'next-auth/react'
import { ImovelLer } from '@/types/imovel'

export default function ListarImoveis() {
  const { data: session } = useSession()
  const [imoveis, setImoveis] = useState([] as ImovelLer[])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imovelSelecionado, setImovelSelecionado] = useState<string | null>(
    null
  )

  const fetchImoveis = async () => {
    try {
      const response = await fetch(
        `/api/imoveis/?query=imobiliariaId:${session?.user.id}`
      )
      if (!response.ok) {
        const message = await response.json()
        throw new Error(message.message || 'Erro ao buscar imóveis')
      }
      const data = await response.json()
      setImoveis(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) fetchImoveis()
  }, [session?.user])

  return (
    <div className="flex p-[64px_24px] flex-col items-center gap-8 w-full justify-between">
      {/* Conteúdo Superior */}
      <div className="flex gap-6 items-center w-full">
        <a href="/inicio">
          <ArrowLeft size={32} color="black" />
        </a>
        <h1 className="">Imóveis Cadastrados</h1>
      </div>

      <CustomButton text="Adicionar novo imóvel" href="/imoveis/novo" />

      {/* Renderiza a lista de imóveis */}
      {loading ? (
        // Esqueleto de carregamento no EditImovel
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro ao carregar imóveis: {error}</p>
      ) : imoveis.length > 0 ? (
        <div className="pb-20">
          {imoveis.map((imovel) => (
            <EditImovel
              key={imovel.id}
              imovel={imovel}
              onExcluir={fetchImoveis}
              selecionado={imovelSelecionado === imovel.id}
              onSelecionar={() =>
                setImovelSelecionado((prev) =>
                  prev === imovel.id ? null : imovel.id
                )
              }
            />
          ))}
        </div>
      ) : (
        <p>Não há imóveis cadastrados.</p>
      )}

      <Footer activeState="Perfil" />
    </div>
  )
}
