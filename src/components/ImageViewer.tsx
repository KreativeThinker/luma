'use client'

import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { EffectCoverflow, Navigation, Keyboard } from 'swiper/modules'
import { X, InfoIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { motion } from 'framer-motion'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css'

interface ImageViewerProps {
  files: File[]
  initialIndex?: number
  onClose: () => void
}

export default function ImageViewer({ files, initialIndex = 0, onClose }: ImageViewerProps) {
  const [showMetadata, setShowMetadata] = useState(false)

  // Create blob URLs for each file
  const imageUrls = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        metadata: {
          Name: file.name,
          Size: formatSize(file.size),
          Type: file.type,
          'Last Modified': new Date(file.lastModified).toLocaleString(),
        },
      })),
    [files]
  )

  useEffect(() => {
    return () => imageUrls.forEach((i) => URL.revokeObjectURL(i.url))
  }, [imageUrls])

  // Keyboard shortcut for close and metadata toggle
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'i' || e.key === 'I') setShowMetadata((prev) => !prev)
    },
    [onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close + Info */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur"
        >
          <InfoIcon size={18} />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur"
        >
          <X size={18} />
        </button>
      </div>

      {/* Carousel */}
      <Swiper
        modules={[EffectCoverflow, Navigation, Keyboard]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={2.4}
        loop
        initialSlide={initialIndex}
        keyboard={{ enabled: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 2.5,
          slideShadows: false,
        }}
        className="w-full h-full flex items-center justify-center"
      >
        {imageUrls.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative flex items-center justify-center h-screen select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                draggable={false}
                className="max-h-[85vh] max-w-[85vw] object-contain transition-all duration-500"
              />
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Arrows */}
        <div className="swiper-button-prev !left-6 z-[60] after:hidden">
          <ChevronLeft className="w-8 h-8 text-white opacity-80 hover:opacity-100 transition" />
        </div>
        <div className="swiper-button-next !right-6 z-[60] after:hidden">
          <ChevronRight className="w-8 h-8 text-white opacity-80 hover:opacity-100 transition" />
        </div>
      </Swiper>

      {showMetadata && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="absolute top-0 right-0 bottom-0 w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto z-[70]"
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-lg font-semibold text-white">Image Info</h3>
            <button
              onClick={() => setShowMetadata(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Metadata entries */}
          {imageUrls[initialIndex] &&
            Object.entries(imageUrls[initialIndex].metadata).map(([key, val]) => (
              <div key={key} className="mb-3">
                <div className="text-xs text-gray-400 uppercase tracking-wider">{key}</div>
                <div className="text-sm text-white font-mono break-all">{val}</div>
              </div>
            ))}
        </motion.div>
      )}
    </motion.div>
  )
}

function formatSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < sizes.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${sizes[unitIndex]}`
}
