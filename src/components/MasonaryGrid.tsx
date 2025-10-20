'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageViewer from './ImageViewer'

interface MasonryGridProps {
  fileUrls: string[]
}

export default function MasonryGrid({ fileUrls }: MasonryGridProps) {
  const observer = useRef<IntersectionObserver | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              img.src = img.dataset.src || ''
              observer.current?.unobserve(img)
            }
          })
        },
        { rootMargin: '100px' }
      )
    }

    const imgs = document.querySelectorAll('.lazy-image')
    imgs.forEach((img) => observer.current?.observe(img))

    return () => observer.current?.disconnect()
  }, [fileUrls])

  const handleClose = () => setSelected(null)
  const handleNext = () => setSelected((i) => (i !== null && i < fileUrls.length - 1 ? i + 1 : i))
  const handlePrev = () => setSelected((i) => (i !== null && i > 0 ? i - 1 : i))
  const hoverVariants = {
    initial: { scale: 1, y: 0, zIndex: 1 },
    hover: {
      scale: 1.05,
      y: -6,
      zIndex: 10,
      transition: { type: 'spring', stiffness: 220, damping: 15 },
    },
  }
  if (!fileUrls.length) return <div className="text-center mt-8">No images loaded.</div>

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-4 lg:columns-5 gap-4 p-4">
        {fileUrls.map((url, i) => (
          <motion.div
            key={i}
            layoutId={url}
            variants={hoverVariants}
            initial="initial"
            whileHover="hover"
            className="relative mb-4 break-inside-avoid"
            onClick={() => setSelected(i)}
          >
            <motion.img
              data-src={url}
              alt={`image-${i}`}
              className="lazy-image w-full rounded-lg object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            />

            {/* Optional: subtle overlay on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-black/0"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <ImageViewer
            imageUrl={fileUrls[selected]}
            metadata={{ filename: fileUrls[selected].split('/').pop() }}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </>
  )
}
