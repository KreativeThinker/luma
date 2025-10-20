'use client'
import React, { useEffect, useState } from 'react'
import { Folder, ArrowLeft } from 'lucide-react'

interface FileNode {
  name: string
  path: string
  isDir: boolean
  children?: FileNode[]
  fileUrl?: string
}

interface DirectoryListProps {
  tree: FileNode[]
  onDirectoryImages: (urls: string[]) => void
}

export default function DirectoryList({ tree, onDirectoryImages }: DirectoryListProps) {
  const [pathStack, setPathStack] = useState<FileNode[][]>([tree])

  const currentDir = pathStack[pathStack.length - 1]

  // Load all images on first render (root)
  useEffect(() => {
    const allImages = collectAllImages(tree)
    onDirectoryImages(allImages)
  }, [tree])

  const handleFolderClick = (node: FileNode) => {
    if (node.children && node.children.length > 0) {
      setPathStack((prev) => [...prev, node.children])
      const images = collectAllImages(node.children)
      onDirectoryImages(images)
    }
  }

  const handleBack = () => {
    if (pathStack.length > 1) {
      const newStack = pathStack.slice(0, -1)
      setPathStack(newStack)
      const parent = newStack[newStack.length - 1]
      const images = collectAllImages(parent)
      onDirectoryImages(images)
    }
  }

  const collectAllImages = (nodes: FileNode[]): string[] => {
    return nodes.flatMap((n) =>
      n.isDir && n.children ? collectAllImages(n.children) : n.fileUrl ? [n.fileUrl] : []
    )
  }

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Explorer</h2>
        {pathStack.length > 1 && (
          <button onClick={handleBack} className="flex items-center gap-1 text-sm">
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
              className="flex items-center gap-2 p-2 rounded-md"
              onClick={() => handleFolderClick(node)}
            >
              <Folder size={18} />
              {<span className="truncate">{node.name}</span>}
            </li>
          ))}
      </ul>
    </div>
  )
}
