import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon | string
  loading?: boolean
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({ title, value, icon, loading, subtitle, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm flex items-center mt-1 ${
              trend.value >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          {typeof icon === 'string' ? (
            <span className="text-2xl" role="img" aria-label="icon">{icon}</span>
          ) : (
            <icon className="h-6 w-6 text-gray-600" />
          )}
        </div>
      </div>
    </div>
  )
}