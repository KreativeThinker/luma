'use client'
import React, { useEffect, useState } from 'react'
import { Folder, ArrowLeft } from 'lucide-react'

interface FileNode {
  name: string
  path: string
  isDir: boolean
  children?: FileNode[]
  file?: File
}

interface DirectoryListProps {
  tree: FileNode[]
  onDirectoryImages: (files: File[]) => void
}

export default function DirectoryList({ tree, onDirectoryImages }: DirectoryListProps) {
  const [pathStack, setPathStack] = useState<FileNode[][]>([tree])

  const currentDir = pathStack[pathStack.length - 1]

  // Load all images on first render (root)
  useEffect(() => {
    console.log('DirectoryList mounted, tree:', tree)
    const allImages = collectAllImages(tree)
    console.log('Collected images on mount:', allImages.length)
    onDirectoryImages(allImages)
  }, [tree])

  const handleFolderClick = (node: FileNode) => {
    console.log('Folder clicked:', node.name, 'has children:', !!node.children)
    if (node.children && node.children.length > 0) {
      setPathStack((prev) => [...prev, node.children!])
      const images = collectAllImages(node.children)
      console.log('Images in folder:', images.length)
      onDirectoryImages(images)
    }
  }

  const handleBack = () => {
    if (pathStack.length > 1) {
      const newStack = pathStack.slice(0, -1)
      setPathStack(newStack)
      const parent = newStack[newStack.length - 1]
      const images = collectAllImages(parent)
      console.log('Back pressed, images:', images.length)
      onDirectoryImages(images)
    }
  }

  const collectAllImages = (nodes: FileNode[]): File[] => {
    const files = nodes.flatMap((n) =>
      n.isDir && n.children ? collectAllImages(n.children) : n.file ? [n.file] : []
    )
    return files
  }

  console.log('Current dir:', currentDir.length, 'items')

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Explorer</h2>
        {pathStack.length > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm hover:underline cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
      </div>

      <ul className="space-y-2 text-sm">
        {currentDir
          .filter((n) => n.isDir)
          .map((node) => (
            <li
              key={node.path}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => handleFolderClick(node)}
            >
              <Folder size={18} className="flex-shrink-0" />
              <span className="truncate">{node.name}</span>
            </li>
          ))}
      </ul>

      {currentDir.filter((n) => n.isDir).length === 0 && (
        <div className="text-center text-gray-400 text-sm py-4">No subdirectories</div>
      )}
    </div>
  )
}
