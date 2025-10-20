'use client'
import { AnimatePresence, motion } from 'framer-motion'
import UploadHandler from '@/components/UploadHandler'
import DirectoryList from '@/components/DirectoryList'
import MasonryGrid from '@/components/MasonryGrid'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

// Updated FileNode interface - removed fileUrl, added file
interface FileNode {
  name: string
  path: string
  isDir: boolean
  children?: FileNode[]
  file?: File // Changed from fileUrl to file
}

export default function App() {
  const [tree, setTree] = useState<FileNode[]>([])
  const [activeImages, setActiveImages] = useState<File[]>([]) // Changed from string[] to File[]
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {!tree.length ? (
        <div className="w-full max-w-2xl mt-20">
          <UploadHandler onTreeReady={setTree} />
        </div>
      ) : (
        <div className="w-full flex gap-6 relative">
          {/* Mobile drawer toggle button - only visible when drawer is closed */}
          {!isDrawerOpen && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden fixed left-4 top-6 z-40 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
          <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-6 self-start">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
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
                <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full overflow-hidden flex flex-col">
                  {/* Close button - fixed to the right side of the panel */}
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="absolute right-4 top-4 z-10 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
          <main className="flex-1 min-w-0 lg:ml-0">
            <MasonryGrid files={activeImages} />
          </main>
        </div>
      )}
    </div>
  )
}
