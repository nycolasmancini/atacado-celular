import { CatalogoSkeleton } from '@/components/catalog/CatalogoSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <CatalogoSkeleton />
    </div>
  )
}