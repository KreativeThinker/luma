interface FileNode {
  name: string
  path: string
  isDir: boolean
  children?: FileNode[]
  file?: File
}
