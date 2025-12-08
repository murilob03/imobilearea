'use client'

import React from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  confirmButtonColor?: 'marrom' | 'red' | 'green'
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  confirmButtonColor = 'marrom'
}) => {
  if (!isOpen) return null

  const getConfirmButtonClasses = () => {
    const baseClasses = "flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-colors"
    
    switch (confirmButtonColor) {
      case 'red':
        return `${baseClasses} bg-red-500 hover:bg-red-600`
      case 'green':
        return `${baseClasses} bg-green-500 hover:bg-green-600`
      case 'marrom':
      default:
        return `${baseClasses} bg-marrom hover:bg-opacity-90`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 shadow-xl">
        <h3 className="text-xl font-bold text-center mb-4">
          {title}
        </h3>
        <p className="text-center text-gray-700 mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={getConfirmButtonClasses()}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
