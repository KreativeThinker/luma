'use client'
import React from 'react'

interface UploadHandlerProps {
  onTreeReady: (tree: FileNode[]) => void
}

export default function UploadHandler({ onTreeReady }: UploadHandlerProps) {
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const imageFiles = files.filter((f) => f.type.startsWith('image/'))

    const insertNode = (tree: FileNode[], parts: string[], file: File) => {
      let currentLevel = tree
      let currentPath = ''

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part
        let existing = currentLevel.find((n) => n.name === part)

        if (!existing) {
          existing = {
            name: part,
            path: currentPath,
            isDir: index < parts.length - 1,
            children: index < parts.length - 1 ? [] : undefined,
          }
          currentLevel.push(existing)
        }

        // Leaf file node (image) - STORE THE FILE OBJECT
        if (index === parts.length - 1) {
          existing.isDir = false
          existing.file = file // Store actual File object, not URL
        } else if (existing.children) {
          currentLevel = existing.children
        }
      })
    }

    const tree: FileNode[] = []
    imageFiles.forEach((file) => {
      const relPath = (file as any).webkitRelativePath || file.name
      const parts = relPath.split('/').filter(Boolean)
      insertNode(tree, parts, file)
    })

    onTreeReady(tree)
  }

  return (
    <div className="flex items-center justify-center border-2 border-dashed border-neutral-2 rounded-lg p-12">
      <label
        htmlFor="folderUpload"
        className="flex flex-col items-center justify-center w-full h-full text-center cursor-pointer"
      >
        <span className="font-medium text-lg">Click to upload a folder</span>
        <span className="text-sm mt-1">Only image files are processed</span>
      </label>
      <input
        id="folderUpload"
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        accept="image/*"
        className="hidden h-full w-full"
        onChange={handleFolderUpload}
      />
    </div>
  )
}
