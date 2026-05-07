"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export interface UploadedFile {
  id: string
  file: File
  preview: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface ImageUploaderProps {
  onUpload?: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSizeInMB?: number
  acceptedTypes?: string[]
}

export function ImageUploader({
  onUpload,
  maxFiles = 10,
  maxSizeInMB = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}: ImageUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de arquivo não suportado. Use: ${acceptedTypes.map((t) => t.split("/")[1]).join(", ")}`
    }
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `Arquivo muito grande. Máximo: ${maxSizeInMB}MB`
    }
    return null
  }

  const processFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const remainingSlots = maxFiles - files.length

      if (remainingSlots <= 0) {
        alert(`Máximo de ${maxFiles} arquivos permitidos`)
        return
      }

      const filesToAdd = fileArray.slice(0, remainingSlots)

      const processedFiles: UploadedFile[] = filesToAdd.map((file) => {
        const error = validateFile(file)
        return {
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
          status: error ? "error" : "pending",
          progress: 0,
          error: error || undefined,
        }
      })

      setFiles((prev) => [...prev, ...processedFiles])
    },
    [files.length, maxFiles, maxSizeInMB, acceptedTypes]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files)
      }
    },
    [processFiles]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])
const handleUpload = async () => {
  const pendingFiles = files.filter((f) => f.status === "pending")
  if (pendingFiles.length === 0) return

  setIsUploading(true)

  try {
    // Passo 1: Enviar TODOS os nomes em uma única requisição
    const req = await fetch(
      process.env.NEXT_PUBLIC_LAMBDA_URL!,
      {
        method: "POST",
        body: JSON.stringify({ 
          pendingFiles: pendingFiles.map((f) => ({
            fileNames: f.file.name,
            contentType: f.file.type
          })),
        }),
        headers: {
          "Content-Type":"application/json"
        },
      }
    )

    const res = await req.json()
   

    const uploadUrls = JSON.parse(res.body);
   

    // Passo 2: Fazer upload dos arquivos direto ao S3
    const s3Uploads = pendingFiles.map((uploadedFile, index) =>
      fetch(uploadUrls[index].uploadUrl, {
        method: "PUT",
        body: uploadedFile.file,
        headers: {
          "Content-Type": uploadedFile.file.type,
        },
      })
    )

    const s3Responses = await Promise.all(s3Uploads)
    const allSuccess = s3Responses.every((res) => res.ok)

    if (!allSuccess) {
      throw new Error("Falha no upload de um ou mais arquivos")
    }

    setFiles((prev) =>
      prev.map((f) =>
        pendingFiles.some((pf) => pf.id === f.id)
          ? { ...f, status: "success" as const }
          : f
      )
    )
    clearAll()
  } catch (error) {
    console.error("Erro no upload:", error)
    setFiles((prev) =>
      prev.map((f) =>
        pendingFiles.some((pf) => pf.id === f.id)
          ? {
              ...f,
              status: "error" as const,
              error: error instanceof Error ? error.message : "Erro no upload",
            }
          : f
      )
    )
  } finally {
    setIsUploading(false)
  }
}
  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
  }

  const pendingCount = files.filter((f) => f.status === "pending").length
  const successCount = files.filter((f) => f.status === "success").length

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-sm p-12 text-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-16 h-16 rounded-sm border-2 flex items-center justify-center transition-colors",
              isDragging ? "border-primary bg-primary/10" : "border-border"
            )}
          >
            <Upload
              className={cn(
                "w-8 h-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              Drag and drop your images here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select files 
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded-sm">JPG</span>
            <span className="px-2 py-1 bg-muted rounded-sm">PNG</span>
            <span className="px-2 py-1 bg-muted rounded-sm">GIF</span>
            <span className="px-2 py-1 bg-muted rounded-sm">WebP</span>
            <span className="px-2 py-1 bg-muted rounded-sm">
              Máx. {maxSizeInMB}MB
            </span>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Arquivos Selecionados ({files.length}/{maxFiles})
            </h3>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Limpar tudo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative group border-2 border-border rounded-sm overflow-hidden bg-card"
              >
                {/* Preview Image */}
                <div className="aspect-video relative bg-muted">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Status Overlay */}
                  {file.status === "uploading" && (
                    <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center">
                      <div className="text-center text-secondary-foreground">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <span className="text-sm font-medium">{file.progress}%</span>
                      </div>
                    </div>
                  )}

                  {file.status === "success" && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.id)
                    }}
                    className="absolute top-2 left-2 w-6 h-6 bg-secondary text-secondary-foreground rounded-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* File Info */}
                <div className="p-3 border-t-2 border-border">
                  <p className="text-sm font-medium truncate text-foreground">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {file.error && (
                    <p className="text-xs text-destructive mt-1">{file.error}</p>
                  )}

                  {/* Progress Bar */}
                  {file.status === "uploading" && (
                    <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-200"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-border">
            <div className="text-sm text-muted-foreground">
              {pendingCount > 0 && (
                <span>{pendingCount} arquivo(s) pronto(s) para upload</span>
              )}
              {successCount > 0 && pendingCount === 0 && (
                <span className="text-green-600">
                  {successCount} arquivo(s) enviado(s) com sucesso
                </span>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={pendingCount === 0 || isUploading}
              className="min-w-32"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="text-center py-8 border-2 border-border rounded-sm bg-card">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No images selected yet. Drag and drop files above or click to choose.
          </p>
        </div>
      )}
    </div>
  )
}
