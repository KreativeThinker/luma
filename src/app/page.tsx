'use client'
import UploadHandler from '@/components/UploadHandler'
import DirectoryList from '@/components/DirectoryList'
import MasonryGrid from '@/components/MasonaryGrid'
import React, { useState } from 'react'

interface FileNode {
  name: string
  path: string
  isDir: boolean
  children?: FileNode[]
  fileUrl?: string
}

export default function App() {
  const [tree, setTree] = useState<FileNode[]>([])
  const [activeImages, setActiveImages] = useState<string[]>([])

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {!tree.length ? (
        <UploadHandler onTreeReady={setTree} />
      ) : (
        <div className="w-full max-w-6xl flex flex-col gap-6">
          <DirectoryList tree={tree} onDirectoryImages={setActiveImages} />
          <MasonryGrid fileUrls={activeImages} />
        </div>
      )}
    </div>
  )
}
