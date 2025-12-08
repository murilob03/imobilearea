import React from 'react'

interface InputFieldProps {
  label?: string
  type: string
  name: string
  placeholder: string
  required?: boolean
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void // 👈 NOVO
}

export default function InputField({
  label,
  type,
  name,
  placeholder,
  required,
  className = '',
  value,
  onChange,
  onKeyDown, // 👈 NOVO
}: InputFieldProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      {label && <p className="font-bold">{label}</p>}
      <input
        className={`flex border w-full bg-bege border-solid border-black rounded-2xl p-[18px_8px] ${className}`}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown} // 👈 NOVO
      />
    </div>
  )
}
