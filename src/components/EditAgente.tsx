import React, { useState } from 'react'
import Image from 'next/image'
import { AgenteLer } from '@/types/usuarios'
import ConfirmModal from './ConfirmModal'

interface EditAgenteProps {
  agente: AgenteLer
  onDelete?: () => void
  isExpanded?: boolean
  onToggle?: () => void
}

const EditAgente = ({ 
  agente, 
  onDelete, 
  isExpanded = false, 
  onToggle 
}: EditAgenteProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/agente/${agente.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setShowDeleteModal(false)
        if (onDelete) {
          onDelete()
        }
      } else {
        console.error('Erro ao excluir agente')
      }
    } catch (error) {
      console.error('Erro ao excluir agente:', error)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
        isExpanded ? 'bg-marrom_claro text-black p-6' : 'bg-bege text-black p-4'
      }`}
    >
      {/* Botão principal */}
      <button
        onClick={handleToggle}
        className="w-full flex py-3 items-center transition-colors duration-300"
      >
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-4 border-marrom flex-shrink-0">
          <Image
            src="/koreano.png"
            alt="Foto do agente"
            className="w-full h-full object-cover"
            priority
            width={60}
            height={60}
          />
        </div>
        <div className="flex w-full flex-col items-start justify-between ml-4">
          <h3 className="font-bold">{agente.name}</h3>
          <p>CRECI: {agente.creci}</p>
        </div>
      </button>

      {/* Botões adicionais, aparecem somente quando expandido */}
      {isExpanded && (
        <div className="flex w-full flex-shrink-0 gap-3">
          <button
            className="flex w-full py-3 justify-center bg-white rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteClick()
            }}
          >
            Excluir
          </button>
        </div>
      )}

      {/* Modal de confirmação para exclusão */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Excluir Agente"
        message={`Tem certeza que deseja excluir o agente ${agente.name} (CRECI: ${agente.creci})? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmButtonColor="red"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default EditAgente
