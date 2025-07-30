'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { exportToCSV } from '@/lib/reports'

interface Column {
  key: string
  title: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface ReportTableProps {
  columns: Column[]
  data: any[]
  title: string
  loading?: boolean
  emptyMessage?: string
}

type SortDirection = 'asc' | 'desc' | null

export function ReportTable({ 
  columns, 
  data, 
  title, 
  loading = false, 
  emptyMessage = 'Nenhum dado encontrado para o período selecionado' 
}: ReportTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: SortDirection
  }>({ key: '', direction: null })

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key)
    if (!column?.sortable) return

    let direction: SortDirection = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null
    }

    setSortConfig({ key, direction })
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.direction || !sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue === bValue) return 0

    let result = 0
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = aValue.localeCompare(bValue)
    } else if (aValue instanceof Date && bValue instanceof Date) {
      result = aValue.getTime() - bValue.getTime()
    } else {
      result = aValue < bValue ? -1 : 1
    }

    return sortConfig.direction === 'desc' ? -result : result
  })

  const handleExport = () => {
    if (data.length === 0) {
      alert('Não há dados para exportar')
      return
    }

    // Transform data for CSV export
    const exportData = data.map(row => {
      const exportRow: any = {}
      columns.forEach(column => {
        if (column.render) {
          // For rendered columns, we'll use the raw value
          exportRow[column.title] = row[column.key]
        } else {
          exportRow[column.title] = row[column.key]
        }
      })
      return exportRow
    })

    const filename = title.toLowerCase().replace(/\s+/g, '_')
    exportToCSV(exportData, filename)
  }

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return '↕️'
    if (sortConfig.direction === 'asc') return '↑'
    if (sortConfig.direction === 'desc') return '↓'
    return '↕️'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {data.length} registro{data.length !== 1 ? 's' : ''}
          </span>
          {data.length > 0 && (
            <Button size="sm" variant="outline" onClick={handleExport}>
              Exportar CSV
            </Button>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-gray-500 text-lg font-medium mb-2">Sem dados</p>
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.title}
                      {column.sortable && (
                        <span className="text-gray-400 text-sm">
                          {getSortIcon(column.key)}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : (
                        <span className="text-sm text-gray-900">
                          {row[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}