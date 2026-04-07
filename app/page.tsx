import { ImageUploader } from "@/components/image-uploader"
import { UploadInstructions } from "@/components/upload-instructions"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground uppercase tracking-wide">
                Upload de Imagens
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sistema de upload para integração com AWS S3
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase rounded-sm border border-primary/20">
                MVP
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-2">
                Passo 1: Selecione as Imagens
              </h2>
              <p className="text-muted-foreground">
                Faça upload de arquivos .jpg, .png, .gif ou .webp. Limite de 10MB por arquivo.
              </p>
            </div>

            <ImageUploader maxFiles={10} maxSizeInMB={10} />
          </div>

          {/* Instructions Sidebar */}
          <div className="lg:col-span-1">
            <UploadInstructions />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Frontend MVP para integração com AWS S3</p>
            <div className="flex items-center gap-4">
              <a
                href="https://docs.aws.amazon.com/s3/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Documentação AWS S3
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
