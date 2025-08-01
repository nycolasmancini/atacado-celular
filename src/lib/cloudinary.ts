import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

// Configuração do Cloudinary com env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Função para fazer upload de uma imagem com otimizações automáticas
export async function uploadImage(
  file: Buffer | string,
  folder: string = 'produtos'
): Promise<{ url: string; publicId: string }> {
  try {
    const fileData = Buffer.isBuffer(file) 
      ? `data:image/jpeg;base64,${file.toString('base64')}`
      : file

    const result = await cloudinary.uploader.upload(fileData, {
      folder: `atacado-celular/${folder}`,
      overwrite: true,
      resource_type: 'image',
      // Otimizações automáticas
      quality: 'auto:eco',
      fetch_format: 'auto',
      width: 800,
      crop: 'limit',
      // Garantir formato webp quando possível
      format: 'auto'
    })

    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error)
    throw new Error('Falha no upload da imagem')
  }
}

// Função para deletar uma imagem
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Erro ao deletar imagem do Cloudinary:', error)
    throw new Error('Falha ao deletar imagem')
  }
}