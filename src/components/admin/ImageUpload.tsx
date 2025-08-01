'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ImageUploadProps {
  value?: string
  onChange: (url: string, publicId?: string) => void
  onRemove?: () => void
  disabled?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryFile, setRetryFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File, isRetry = false) => {
    if (!file) return

    // Validações
    if (!file.type.startsWith('image/')) {
      setError('Apenas arquivos de imagem são permitidos')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB permitido')
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)
    if (!isRetry) setRetryFile(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (data.success) {
        onChange(data.url, data.publicId)
        setRetryFile(null)
        setError(null)
      } else {
        throw new Error(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      setError(error instanceof Error ? error.message : 'Erro no upload da imagem')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRetry = () => {
    if (retryFile) {
      handleFileSelect(retryFile, true)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    } else {
      onChange('')
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Imagem do Produto
      </label>

      {value ? (
        // Preview da imagem
        <div className="relative">
          <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            
            {!disabled && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClick}
                    disabled={uploading}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Alterar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemove}
                    disabled={uploading}
                    className="bg-red-500 text-white hover:bg-red-600 border-red-500"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Upload area
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : error ? (
                <X className="w-6 h-6 text-red-400" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">
                {uploading 
                  ? `Fazendo upload... ${uploadProgress}%`
                  : error 
                    ? 'Erro no upload'
                    : 'Clique ou arraste uma imagem'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG até 5MB
              </p>
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Error message and retry */}
            {error && (
              <div className="mt-2 text-center">
                <p className="text-xs text-red-600 mb-2">{error}</p>
                {retryFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRetry()
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Tentar Novamente
                  </Button>
                )}
              </div>
            )}

            {!uploading && !error && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                className="mt-2"
              >
                <Upload className="w-4 h-4 mr-1" />
                Selecionar Arquivo
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Success message */}
      {value && !error && (
        <div className="text-xs text-green-600 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Imagem carregada com sucesso
        </div>
      )}

      <p className="text-xs text-gray-500">
        Recomendado: 800x800px ou maior. Otimização automática para web (WebP)
      </p>
    </div>
  )
}