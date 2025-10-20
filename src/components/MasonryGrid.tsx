'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageViewer from './ImageViewer'

interface MasonryGridProps {
  files: File[]
}

export default function MasonryGrid({ files }: MasonryGridProps) {
  const [selected, setSelected] = useState<number | null>(null)

  // Create object URLs for all files immediately
  const fileUrls = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file))
  }, [files])

  // Cleanup object URLs on unmount or when files change
  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [fileUrls])

  const handleClose = () => setSelected(null)

  const hoverVariants = {
    initial: { scale: 1, y: 0, zIndex: 1 },
    hover: {
      scale: 1.05,
      y: -6,
      zIndex: 10,
      transition: { type: 'spring', stiffness: 220, damping: 15 },
    },
  }

  if (!files.length) return <div className="text-center mt-8 text-gray-500">No images loaded.</div>

  console.log('MasonryGrid rendering with files:', files.length)

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-4 lg:columns-5 gap-4 p-4">
        {files.map((file, i) => (
          <motion.div
            key={`${file.name}-${i}`}
            layoutId={fileUrls[i]}
            // @ts-expect-error - webkitdirectory is not in TypeScript types yet
            variants={hoverVariants}
            initial="initial"
            whileHover="hover"
            className="relative mb-4 break-inside-avoid cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              console.log('Image clicked:', i, file.name)
              setSelected(i)
            }}
          >
            <motion.img
              src={fileUrls[i]}
              alt={file.name}
              className="w-full rounded-lg object-cover bg-gray-200 pointer-events-none"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            />

            {/* Subtle overlay on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-black/0 pointer-events-none"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <ImageViewer
            files={files} // ✅ pass the entire array
            initialIndex={selected} // ✅ tell it which one to start from
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}
