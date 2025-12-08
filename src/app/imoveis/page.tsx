'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'
import EditImovel from '@/components/EditImovel'
import CustomButton from '@/components/CustomButton'
import ConfirmModal from '@/components/ConfirmModal'
import { useSession } from 'next-auth/react'
import { ImovelLer } from '@/types/imovel'

export default function ListarImoveis() {
  const { data: session } = useSession()

  const [imoveis, setImoveis] = useState<ImovelLer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [imovelSelecionado, setImovelSelecionado] = useState<string | null>(null)

  // Modal
  const [mostrarModal, setMostrarModal] = useState(false)
  const [imovelParaExcluir, setImovelParaExcluir] = useState<string | null>(null)

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
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) fetchImoveis()
  }, [session?.user])

  const excluirImovel = async () => {
    if (!imovelParaExcluir) return

    try {
      await fetch(`/api/imoveis/${imovelParaExcluir}`, {
        method: 'DELETE',
      })

      await fetchImoveis()
    } catch (error) {
      console.error('Erro ao excluir imóvel', error)
    } finally {
      setMostrarModal(false)
      setImovelParaExcluir(null)
    }
  }

  return (
    <div className="flex p-[64px_24px] flex-col items-center gap-8 w-full justify-between">
      <div className="flex gap-6 items-center w-full">
        <a href="/inicio">
          <ArrowLeft size={32} color="black" />
        </a>
        <h1>Imóveis Cadastrados</h1>
      </div>

      <CustomButton text="Adicionar novo imóvel" href="/imoveis/novo" />

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro ao carregar imóveis: {error}</p>
      ) : imoveis.length > 0 ? (
        <div className="pb-20 w-full">
          {imoveis.map((imovel) => (
            <EditImovel
              key={imovel.id}
              imovel={imovel}
              selecionado={imovelSelecionado === imovel.id}
              onSelecionar={() =>
                setImovelSelecionado((prev) =>
                  prev === imovel.id ? null : imovel.id
                )
              }
              onExcluir={() => {
                setImovelParaExcluir(imovel.id)
                setMostrarModal(true)
              }}
            />
          ))}
        </div>
      ) : (
        <p>Não há imóveis cadastrados.</p>
      )}

      <ConfirmModal
        isOpen={mostrarModal}
        title="Excluir imóvel"
        message="Tem certeza que deseja excluir este imóvel? Essa ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmButtonColor="red"
        onConfirm={excluirImovel}
        onCancel={() => {
          setMostrarModal(false)
          setImovelParaExcluir(null)
        }}
      />

      <Footer activeState="Perfil" />
    </div>
  )
}
