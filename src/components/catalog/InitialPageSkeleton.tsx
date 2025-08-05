'use client'

import { memo } from 'react'
import { ProductCardSkeleton } from './ProductCardSkeleton'

interface InitialPageSkeletonProps {
  count?: number
}

// Skeleton for initial page load with hero section
const InitialPageSkeletonComponent = ({ count = 20 }: InitialPageSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Navigation skeleton */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Mobile menu button skeleton */}
            <div className="md:hidden">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="w-3/4 h-8 bg-white/20 rounded animate-pulse"></div>
                <div className="w-full h-8 bg-white/20 rounded animate-pulse"></div>
                <div className="w-1/2 h-8 bg-white/20 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-4 bg-white/15 rounded animate-pulse"></div>
                <div className="w-5/6 h-4 bg-white/15 rounded animate-pulse"></div>
                <div className="w-4/5 h-4 bg-white/15 rounded animate-pulse"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-40 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                <div className="w-32 h-12 bg-white/10 rounded-lg animate-pulse border border-white/20"></div>
              </div>
            </div>
            
            {/* Right image placeholder */}
            <div className="hidden lg:block">
              <div className="w-full h-80 bg-white/10 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-64 h-8 bg-gray-200 rounded mx-auto animate-pulse"></div>
          <div className="w-96 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            ></div>
          ))}
        </div>

        {/* Products Count Skeleton */}
        <div className="mb-4 text-center">
          <div className="w-48 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="loading-stagger">
          <ProductCardSkeleton count={count} variant="shimmer" />
        </div>
      </div>
    </div>
  )
}

export const InitialPageSkeleton = memo(InitialPageSkeletonComponent)

// Search Results Skeleton
const SearchResultsSkeletonComponent = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Results Grid */}
      <div className="loading-stagger">
        <ProductCardSkeleton count={count} variant="pulse" />
      </div>
    </div>
  )
}

export const SearchResultsSkeleton = memo(SearchResultsSkeletonComponent)

// Category Page Skeleton
const CategorySkeletonComponent = ({ count = 16 }: { count?: number }) => {
  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 text-center space-y-4">
        <div className="w-64 h-8 bg-gray-200 rounded mx-auto animate-pulse"></div>
        <div className="w-96 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
        <div className="flex justify-center space-x-4 mt-6">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Sorting Options */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Products */}
      <div className="loading-stagger">
        <ProductCardSkeleton count={count} variant="shimmer" />
      </div>
    </div>
  )
}

export const CategorySkeleton = memo(CategorySkeletonComponent)