import { v2 as cloudinary } from 'cloudinary'

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Função para fazer upload de uma imagem
export async function uploadImage(
  file: Buffer,
  filename: string,
  folder: string = 'produtos'
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${file.toString('base64')}`, {
      folder: `atacado-celular/${folder}`,
      public_id: filename,
      overwrite: true,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
      width: 800,
      height: 800,
      crop: 'limit'
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