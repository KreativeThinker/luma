'use client'
import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InfoIcon, X } from 'lucide-react'

interface ImageViewerProps {
  file: File // Changed from imageUrl to file
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export default function ImageViewer({ file, onClose, onNext, onPrev }: ImageViewerProps) {
  const [showMetadata, setShowMetadata] = useState(false)

  // Create URL from File object, memoized
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file])

  // Cleanup URL on unmount or file change
  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onNext?.()
      else if (e.key === 'ArrowLeft') onPrev?.()
      else if (e.key === 'i' || e.key === 'I') setShowMetadata((prev) => !prev)
    },
    [onClose, onNext, onPrev]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Extract metadata from File object
  const metadata = useMemo(() => {
    return {
      Name: file.name,
      Size: file.size,
      Type: file.type,
      'Last Modified': new Date(file.lastModified).toLocaleString(),
      'Webkit Path': (file as any).webkitRelativePath || 'N/A',
    }
  }, [file])

  // Format metadata nicely
  const formatMetadata = (data: Record<string, any>) => {
    return Object.entries(data)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => {
        let formattedValue = value

        // Format file sizes
        if (key === 'Size' && typeof value === 'number') {
          const sizes = ['B', 'KB', 'MB', 'GB']
          let size = value
          let unitIndex = 0
          while (size >= 1024 && unitIndex < sizes.length - 1) {
            size /= 1024
            unitIndex++
          }
          formattedValue = `${size.toFixed(2)} ${sizes[unitIndex]}`
        } else if (typeof value === 'object') {
          formattedValue = JSON.stringify(value, null, 2)
        } else if (typeof value === 'number') {
          formattedValue = value.toLocaleString()
        }

        return { key, value: formattedValue }
      })
  }

  const formattedMetadata = formatMetadata(metadata)

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Fixed size container */}
        <motion.div
          className="relative w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main image container */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt={file.name}
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Navigation buttons */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-2xl backdrop-blur-md transition-all hover:scale-110"
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-2xl backdrop-blur-md transition-all hover:scale-110"
              aria-label="Next image"
            >
              ›
            </button>
          )}

          {/* Top bar with controls */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {formattedMetadata.length > 0 && (
                  <button
                    onClick={() => setShowMetadata(!showMetadata)}
                    className="p-2 text-sm bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-colors"
                    aria-label="Toggle metadata"
                  >
                    <InfoIcon size={20} />
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 text-sm bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-colors"
                aria-label="Close viewer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Metadata sidebar */}
          <AnimatePresence>
            {showMetadata && formattedMetadata.length > 0 && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
              >
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Image Info
                  </h3>

                  <div className="space-y-3">
                    {formattedMetadata.map(({ key, value }, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs text-gray-400 uppercase tracking-wider">{key}</div>
                        <div className="text-sm text-white font-mono break-all">
                          {typeof value === 'string' && value.includes('\n') ? (
                            <pre className="whitespace-pre-wrap">{value}</pre>
                          ) : (
                            value
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
