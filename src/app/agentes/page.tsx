'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import CustomButton from '@/components/CustomButton'
import Footer from '@/components/Footer'
import { useSession } from 'next-auth/react'
import { UserRole } from '@/types'
import Link from 'next/link'
import EditAgente from '@/components/EditAgente'

export default function ListarAgentesCadastrados() {
  const { data: session } = useSession()
  const [agentes, setAgentes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedAgenteId, setExpandedAgenteId] = useState<string | null>(null)

  const fetchAgentes = async () => {
    try {
      const response = await fetch('/api/agente')
      if (!response.ok) {
        throw new Error('Failed to fetch agentes')
      }
      const data = await response.json()
      setAgentes(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAgentes()
  }, [])

  const handleToggleAgente = (agenteId: string) => {
    // Se o agente já está expandido, colapsa. Senão, expande apenas este
    setExpandedAgenteId(expandedAgenteId === agenteId ? null : agenteId)
  }

  if (!session) {
    return <p>Loading session...</p>
  } else if (session.user.role !== UserRole.IMOBILIARIA) {
    return (
      <p className="text-red-500">
        Você não tem permissão para acessar esta página!
      </p>
    )
  }

  if (isLoading) {
    return <p>Loading agentes...</p>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <div className="flex p-[64px_24px] mb-[100px] flex-col items-center gap-8 w-full justify-between">
      {/* Conteúdo Superior */}
      <div className="flex gap-6 items-center w-full">
        <Link href="/inicio">
          <ArrowLeft size={32} color="black" />
        </Link>
        <h1 className="">Agentes Cadastrados</h1>
      </div>

      {/* Lista de Agentes */}
      <div className="flex flex-col gap-6 w-full">
        {agentes.length > 0 ? (
          agentes.map((agente: any, index) => (
            <EditAgente 
              key={agente.id} 
              agente={agente} 
              onDelete={fetchAgentes}
              isExpanded={expandedAgenteId === agente.id}
              onToggle={() => handleToggleAgente(agente.id)}
            />
          ))
        ) : (
          <p>No agentes found.</p>
        )}
      </div>

      <CustomButton
        text="Adicionar novo agente"
        href="/imobiliaria/associar-agentes"
      />
      <Footer activeState="Perfil" />
    </div>
  )
}
