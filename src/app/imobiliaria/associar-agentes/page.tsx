'use client'

import AgenteCard from '@/components/AgenteCard'
import CustomButton from '@/components/CustomButton'
import InputField from '@/components/InputField'
import ConfirmModal from '@/components/ConfirmModal'
import { UserRole } from '@/types'
import { AgenteLer } from '@/types/usuarios'
import { Search, ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AssociarAgente() {
  const { data: session } = useSession()
  const router = useRouter()

  const [agente, setAgente] = useState<AgenteLer | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  if (!session) {
    return <p>Loading...</p>
  } else if (session.user.role !== UserRole.IMOBILIARIA) {
    return (
      <p className="text-red-500">
        Você não tem permissão para acessar esta página!
      </p>
    )
  }

  const handleSearch = async () => {
    setHasSearched(true)
    setAgente(null)

    const creciInput = document.querySelector(
      'input[name="creci"]'
    ) as HTMLInputElement

    if (!creciInput) {
      setErrorMessage('Forneça um número CRECI válido.')
      return
    }

    const creci = creciInput.value

    try {
      if (!creci) throw new Error('Por favor, insira um número CRECI válido.')

      const response = await fetch(`/api/agente?creci=${creci}`)
      if (response.status === 404) {
        setAgente(null)
        setErrorMessage('Agente não encontrado.')
        return
      }
      if (!response.ok) throw new Error('Erro ao buscar o agente.')

      const agenteFetched = await response.json()
      setAgente(agenteFetched)

      console.log(agente)

      setErrorMessage(null) // Clear error message
    } catch (error: any) {
      setAgente(null)
      setErrorMessage(error.message || 'Erro desconhecido.')
    }
  }

  const handleAddAgente = () => {
    if (!agente) {
      return
    }
    setShowConfirmModal(true)
  }

  const confirmAssociation = async () => {
    if (!agente) {
      return
    }

    try {
      const response = await fetch(`/api/agente/${agente.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imobiliariaId: session.user.id,
        }),
      })
      if (!response.ok) throw new Error('Erro ao associar o agente.')
      const data = await response.json()

      setAgente(null)
      setHasSearched(false)
      setShowConfirmModal(false)

      // Mensagem de sucesso
      setErrorMessage(null)
      console.log(data)
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro desconhecido.')
      setShowConfirmModal(false)
    }
  }

  const cancelAssociation = () => {
    setShowConfirmModal(false)
  }

  const SearchResults = ({
    agente,
    session,
    hasSearched,
    handleAddAgente,
  }: {
    agente: AgenteLer | null
    session: any
    hasSearched: boolean
    handleAddAgente: () => void
  }) => {
    if (errorMessage) {
      return <p className="text-red-500 mt-[16px]">{errorMessage}</p>
    }

    if (!hasSearched) return null

    if (!agente) {
      return (
        <p className="text-red-500 mt-[16px]">
          {errorMessage || 'Nenhum agente encontrado.'}
        </p>
      )
    }

    if (agente.imobiliariaId) {
      if (agente.imobiliariaId === session.user.id) {
        return (
          <p className="text-green-500 mt-[16px]">
            Agente já associado à sua imobiliária.
          </p>
        )
      }
      return (
        <p className="text-red-500 mt-[16px]">
          Agente já associado a outra imobiliária.
        </p>
      )
    }

    return (
      <div className="flex flex-col items-center mt-[16px]">
        <AgenteCard agente={agente} />
        <div className="flex justify-end mt-[16px]">
          <button
            className="flex justify-center items-center text-xs rounded-full transition-all duration-300 bg-marrom"
            onClick={handleAddAgente}
          >
            <p className="text-white font-bold px-4 py-2">Associar</p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center bg-bege">
      <div className="p-[64px_24px] flex flex-col w-full h-screen justify-between">
        <div>
          <h1 className="flex items-center text-2xl font-bold mb-[48px] gap-4">
            <ArrowLeft
              size={48}
              className="cursor-pointer"
              onClick={() => router.back()}
            />
            ASSOCIAR AGENTES IMOBILIÁRIOS...
          </h1>
          <p className="text-base mb-[32px]">
            Procure seus agentes imobiliários pelo <br /> número CRECI:
          </p>
          <div className="flex items-center relative">
            <InputField
              label=""
              type="string"
              name="creci"
              placeholder=""
              required
            />
            <Search
              size={24}
              className="absolute right-6 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
          <SearchResults
            agente={agente}
            session={session}
            hasSearched={hasSearched}
            handleAddAgente={handleAddAgente}
          />
        </div>
        <div className="flex flex-col">
          <CustomButton
            text="Continuar"
            onClick={() => {
              router.push('/agentes')
            }}
            type="button"
          />
        </div>
      </div>

      {/* Modal de confirmação */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirmar Associação"
        message={
          agente
            ? `Tem certeza que deseja associar o agente ${agente.name} (CRECI: ${agente.creci}) à sua imobiliária?`
            : ''
        }
        confirmText="Associar"
        onConfirm={confirmAssociation}
        onCancel={cancelAssociation}
      />
    </div>
  )
}
