'use client'
import { AnimatePresence, motion } from 'framer-motion'
import UploadHandler from '@/components/UploadHandler'
import DirectoryList from '@/components/DirectoryList'
import MasonryGrid from '@/components/MasonryGrid'
import { FileNode } from '@/types/FileNode'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function App() {
  const [tree, setTree] = useState<FileNode[]>([])
  const [activeImages, setActiveImages] = useState<File[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)

  const handleUploadMore = (newTree: FileNode[]) => {
    // Merge the new tree with the existing tree
    setTree((prevTree) => [...prevTree, ...newTree])
  }

  return (
    <div className="mx-4 flex min-h-screen flex-col items-center md:mx-8 lg:mx-12">
      {!tree.length ? (
        <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center gap-12 px-4 md:flex-row md:gap-16">
          {/* Left/Text Section */}
          <div className="flex flex-col items-start justify-center space-y-4 text-left">
            <h1 className="text-6xl font-extrabold md:text-8xl">Luma</h1>
            <h4 className="text-xl leading-relaxed md:text-2xl">Minimal Local Image Viewer</h4>
            <ul className="list-disc space-y-2 text-sm md:text-base">
              <li>Upload folders directly from your file system</li>
              <li>Preview in a responsive masonry grid</li>
              <li>Navigate images with keyboard shortcuts</li>
            </ul>
            <a
              href="https://github.com/kreativethinker/luma"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-sm underline-offset-2 hover:underline md:text-base"
            >
              View source on GitHub ↗
            </a>
          </div>

          {/* Upload Section */}
          <div className="flex w-full max-w-xl items-center justify-center">
            <UploadHandler onTreeReady={setTree} />
          </div>
        </div>
      ) : (
        <div className="relative flex w-full gap-4">
          {/* Drawer toggle button - always visible */}
          {!isDrawerOpen && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="border-neutral-2 bg-background fixed top-4 left-4 z-40 rounded-lg border-2 p-3 shadow-lg"
              aria-label="Open directory explorer"
            >
              <Menu size={24} />
            </button>
          )}

          {/* Overlay */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50"
                onClick={() => setIsDrawerOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Single universal drawer */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 bottom-0 left-0 z-50 w-80"
              >
                <div className="bg-background flex h-full flex-col overflow-hidden rounded-r-lg shadow-md">
                  {/* Close button */}
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="bg-card hover:bg-background absolute top-4 right-4 z-10 rounded-lg p-2 transition-colors"
                    aria-label="Close directory explorer"
                  >
                    <X size={20} />
                  </button>

                  <div className="mt-12 flex-1 overflow-y-auto">
                    <DirectoryList
                      tree={tree}
                      onDirectoryImages={setActiveImages}
                      onUploadMore={handleUploadMore}
                    />
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main content */}
          <main className="flex-1">
            <MasonryGrid files={activeImages} />
          </main>
        </div>
      )}
    </div>
  )
}
