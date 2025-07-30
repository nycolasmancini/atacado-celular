'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface DateRange {
  startDate: string
  endDate: string
}

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void
  initialRange?: DateRange
}

export function DateRangePicker({ onDateRangeChange, initialRange }: DateRangePickerProps) {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  const [startDate, setStartDate] = useState(
    initialRange?.startDate || todayStr
  )
  const [endDate, setEndDate] = useState(
    initialRange?.endDate || todayStr
  )
  const [error, setError] = useState('')

  const validateAndApply = (start: string, end: string) => {
    setError('')
    
    if (!start || !end) {
      setError('Ambas as datas são obrigatórias')
      return
    }

    const startDateObj = new Date(start)
    const endDateObj = new Date(end)

    if (startDateObj > endDateObj) {
      setError('Data de início deve ser anterior à data de fim')
      return
    }

    if (endDateObj > today) {
      setError('Data de fim não pode ser futura')
      return
    }

    // Set time to include full days
    startDateObj.setHours(0, 0, 0, 0)
    endDateObj.setHours(23, 59, 59, 999)

    onDateRangeChange(startDateObj, endDateObj)
  }

  const handleApply = () => {
    validateAndApply(startDate, endDate)
  }

  const handlePreset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    
    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]
    
    setStartDate(startStr)
    setEndDate(endStr)
    validateAndApply(startStr, endStr)
  }

  const handleToday = () => {
    setStartDate(todayStr)
    setEndDate(todayStr)
    validateAndApply(todayStr, todayStr)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Período do Relatório</h3>
      
      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleToday}
        >
          Hoje
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handlePreset(6)}
        >
          Últimos 7 dias
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handlePreset(29)}
        >
          Últimos 30 dias
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handlePreset(89)}
        >
          Últimos 90 dias
        </Button>
      </div>

      {/* Custom date range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Início
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={todayStr}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Fim
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={todayStr}
            min={startDate}
          />
        </div>
        
        <div className="flex items-end">
          <Button onClick={handleApply} fullWidth>
            Aplicar Filtro
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Current range display */}
      <div className="mt-4 text-sm text-gray-500">
        <strong>Período selecionado:</strong> {new Date(startDate).toLocaleDateString('pt-BR')} até {new Date(endDate).toLocaleDateString('pt-BR')}
      </div>
    </div>
  )
}