'use client'

import React, { useEffect, useState } from 'react'
import InputField from '@/components/InputField'
import DropdownButton from '@/components/DropdownButton'
import DropdownField from '@/components/DropdownField'
import CustomButton from '@/components/CustomButton'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ImageField from '@/components/ImageField'
import { estadosOptions } from '@/utils/estadoOptions'
import { Endereco } from '@/types/endereco'
import { ImovelCriar } from '@/types/imovel'
import { useSession } from 'next-auth/react'
import { UserRole } from '@/types'
import { AgenteLer } from '@/types/usuarios'

export default function RegistrationForm() {
  const { data: session } = useSession()
  const router = useRouter()

  const [selectedOption, setSelectedOption] = useState('PR')
  const [agenteOptions, setAgenteOptions] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchAgentes = async () => {
      try {
        const response = await fetch('/api/agente')
        if (!response.ok) {
          throw new Error('Failed to fetch agentes')
        }
        const data: AgenteLer[] = await response.json()
        if (data.length > 0) {
          const agentes: Record<string, string> = {} // Define an empty object

          data.forEach((agente) => {
            agentes[agente.name] = agente.id // Assign each name to its corresponding ID
          })

          setAgenteOptions(agentes)
        }
      } catch (error: unknown) {
        console.error('Erro ao buscar agentes:', error)
      }
    }

    if (session) fetchAgentes()
  }, [session?.user])

  if (!session) {
    return <p>Loading...</p>
  } else if (session.user.role !== UserRole.IMOBILIARIA) {
    return (
      <p className="text-red-500">
        Você não tem permissão para acessar esta página!
      </p>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget

    const nome = (form.elements.namedItem('name') as HTMLInputElement).value
    const valor = Number(
      (form.elements.namedItem('valor') as HTMLInputElement).value
    )
    const areaPrivada = parseFloat(
      (form.elements.namedItem('area') as HTMLInputElement).value.replace(
        ',',
        '.'
      )
    )
    const numQuartos = (form.elements.namedItem('quartos') as HTMLInputElement)
      .value
    const numVagas = (form.elements.namedItem('vagas') as HTMLInputElement)
      .value
    const cep = parseInt(
      (form.elements.namedItem('cep') as HTMLInputElement).value.replace(
        '-',
        ''
      )
    )
    const rua = (form.elements.namedItem('rua') as HTMLInputElement).value
    const bairro = (form.elements.namedItem('bairro') as HTMLInputElement).value
    const complemento = (
      form.elements.namedItem('complemento') as HTMLInputElement
    ).value
    const estado = selectedOption
    const cidade = (form.elements.namedItem('cidade') as HTMLInputElement).value
    const tipo = (form.elements.namedItem('tipo') as HTMLSelectElement).value
    const tipoOferta = (
      form.elements.namedItem('tipoOferta') as HTMLSelectElement
    ).value

    const VALOR_MAXIMO_IMOVEL = 100_000_000

    if (isNaN(valor) || valor <= 0) {
      alert('O valor do imóvel deve ser maior que zero.')
      return
    }

    if (valor > VALOR_MAXIMO_IMOVEL) {
      alert('O valor máximo permitido é R$ 100.000.000')
      return
    }

    const agente = (form.elements.namedItem('agentes') as HTMLSelectElement)
      .value
    const agenteId = agenteOptions[agente] || null

    const endereco: Endereco = {
      cep,
      logradouro: rua,
      numero: 123,
      bairro,
      complemento,
      estado,
      cidade,
    }

    const novo_imovel: ImovelCriar = {
      nome,
      valor,
      areaPrivada,
      numQuartos: parseInt(numQuartos),
      numVagas: parseInt(numVagas),
      tipo,
      tipoOferta,
      endereco,
      imobiliariaId: session.user.id,
      agenteId: agenteId,
    }

    try {
      const response = await fetch('/api/imoveis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novo_imovel),
      })

      if (response.ok) {
        console.log('Imóvel criado com sucesso!')
        router.push('/imoveis') //TODO mudar aqui
      } else {
        console.error('Erro ao criar imovel:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao criar imovel:', error)
    }
  }

  return (
    <div className="flex flex-col items-center bg-[#F6F3EC] w-[390px] h-fit mx-auto px-6 py-4">
      <div className="text-left mt-8 mb-6 w-full">
        <h1 className="flex items-center text-2xl font-bold mb-[48px] gap-4">
          <ArrowLeft
            size={24}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          Novo imóvel
        </h1>
      </div>

      <form
        className=" mb-[32px] flex flex-col gap-4 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <InputField
          label="Nome do Imóvel:"
          type="text"
          name="name"
          placeholder=""
          required
        />
        <InputField
          label="Valor do Imóvel:"
          type="number"
          name="valor"
          placeholder=""
          required
        />
        <InputField
          label="Área privada (m²):"
          type="text"
          name="area"
          placeholder=""
          required
        />
        <label className="font-semibold text-base">
          N° de quartos: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; N° de vagas de garagem:
        </label>
        <div className="flex gap-4 items-center">
          <InputField
            className="w-[120px] h-[56px]"
            label=""
            type="number"
            name="quartos"
            placeholder=""
            required
          />
          <InputField
            className="w-[206px] h-[56px]"
            label=""
            type="number"
            name="vagas"
            placeholder=""
            required
          />
        </div>
        <InputField
          label="CEP:"
          type="text"
          name="cep"
          placeholder=""
          required
        />
        <InputField
          label="Rua:"
          type="text"
          name="rua"
          placeholder=""
          required
        />
        <InputField
          label="Bairro:"
          type="text"
          name="bairro"
          placeholder=""
          required
        />
        <InputField
          label="Complemento:"
          type="text"
          name="complemento"
          placeholder=""
          required
        />
        <label className="font-semibold text-base">
          Estado: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cidade:
        </label>
        <div className="flex gap-4 items-center">
          <DropdownButton
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            options={estadosOptions}
          />
          <InputField
            label=""
            type="text"
            name="cidade"
            placeholder=""
            required
          />
        </div>
        <DropdownField
          className="font-bold"
          name="tipo"
          options={['APARTAMENTO', 'CASA', 'COMERCIAL']}
          placeholder="Tipo Imóvel"
        />
        <DropdownField
          className="font-bold"
          name="tipoOferta"
          options={['VENDA', 'ALUGUEL']}
          placeholder="Tipo de Oferta"
        />
        <DropdownField
          className="font-bold"
          name="agentes"
          options={Object.keys(agenteOptions)}
          placeholder="Agentes"
        />
        <ImageField
          className="font-bold"
          name="add-image"
          placeholder="Adicione fotos do imóvel"
        />
        <div className="mt-4">
          <CustomButton text="Concluir" type="submit" />
        </div>
      </form>
    </div>
  )
}
