'use client'
import { AnimatePresence, motion } from 'framer-motion'
import UploadHandler from '@/components/UploadHandler'
import DirectoryList from '@/components/DirectoryList'
import MasonryGrid from '@/components/MasonryGrid'
import { FileNode } from '@/types/FileNode'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function App() {
  const [tree, setTree] = useState<FileNode[]>([])
  const [activeImages, setActiveImages] = useState<File[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center mx-4 md:mx-8 lg:mx-12">
      {!tree.length ? (
        <div className="flex flex-1 flex-col items-center w-full justify-center min-h-screen gap-12 px-4 md:flex-row md:gap-16">
          {/* Left/Text Section */}
          <div className="flex flex-col items-start justify-center text-left space-y-4">
            <h1 className="text-6xl md:text-8xl font-extrabold">Luma</h1>
            <h4 className="text-xl md:text-2xl leading-relaxed">Local Image Viewer</h4>
            <ul className="list-disc space-y-2 text-sm md:text-base">
              <li>Upload folders directly from your file system</li>
              <li>Preview in a responsive masonry grid</li>
              <li>Navigate images with keyboard shortcuts</li>
            </ul>
            <a
              href="https://github.com/kreativethinker/luma"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-sm md:text-base rounded-lg hover:underline underline-offset-2"
            >
              View source on GitHub ↗
            </a>
          </div>

          {/* Upload Section */}
          <div className="flex items-center justify-center w-full max-w-xl">
            <UploadHandler onTreeReady={setTree} />
          </div>
        </div>
      ) : (
        <div className="w-full flex gap-4 relative">
          {/* Mobile drawer toggle button - only visible when drawer is closed */}
          {!isDrawerOpen && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden fixed -left-1.5 top-4 z-40 p-3 bg-card rounded-lg shadow-lg border-2 border-neutral-2"
              aria-label="Open directory explorer"
            >
              <Menu size={24} />
            </button>
          )}

          {/* Overlay for mobile */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsDrawerOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar with directory tree */}
          {/* Desktop: always visible */}
          <aside className="hidden lg:block w-80 top-4 flex-shrink-0 sticky self-start">
            <div className="bg-card rounded-lg shadow-md">
              <DirectoryList tree={tree} onDirectoryImages={setActiveImages} />
            </div>
          </aside>

          {/* Mobile: drawer that slides in */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-80"
              >
                <div className="bg-background rounded-r-lg shadow-md h-full overflow-hidden flex flex-col">
                  {/* Close button - fixed to the right side of the panel */}
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="absolute right-4 top-4 z-10 p-2 rounded-lg bg-card hover:bg-background transition-colors"
                    aria-label="Close directory explorer"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex-1 overflow-y-auto">
                    <DirectoryList tree={tree} onDirectoryImages={setActiveImages} />
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main content area with masonry grid */}
          <main className="flex-1">
            <MasonryGrid files={activeImages} />
          </main>
        </div>
      )}
    </div>
  )
}
