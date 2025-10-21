'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Folder, ArrowLeft } from 'lucide-react'
import { FileNode } from '@/types/FileNode'

interface DirectoryListProps {
  tree: FileNode[]
  onDirectoryImages: (files: File[]) => void
}

export default function DirectoryList({ tree, onDirectoryImages }: DirectoryListProps) {
  const [pathStack, setPathStack] = useState<FileNode[][]>([tree])

  const currentDir = pathStack[pathStack.length - 1]

  // Wrap collectAllImages in useCallback
  const collectAllImages = useCallback((nodes: FileNode[]): File[] => {
    return nodes.flatMap((n) =>
      n.isDir && n.children ? collectAllImages(n.children) : n.file ? [n.file] : []
    )
  }, [])

  // Then the useEffect dependency array is fine
  useEffect(() => {
    console.log('DirectoryList mounted, tree:', tree)
    const allImages = collectAllImages(tree)
    console.log('Collected images on mount:', allImages.length)
    onDirectoryImages(allImages)
  }, [tree, collectAllImages, onDirectoryImages])

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

  console.log('Current dir:', currentDir.length, 'items')

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Explorer</h2>
        {pathStack.length > 1 && (
          <button
            onClick={handleBack}
            className="flex mt-12 items-center gap-1 text-sm hover:font-semibold transition-all"
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
              className="flex items-center gap-2 p-2 rounded-md hover:bg-background transition-colors hover:font-semibold"
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
