import { CheckCircle2, Code, Database, Key, Server } from "lucide-react"

export function UploadInstructions() {
  return (
    <div className="space-y-6">
      {/* AWS Configuration Card */}
      <div className="border-2 border-border rounded-sm bg-card">
        <div className="px-4 py-3 border-b-2 border-border bg-muted/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Configuração AWS
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure as variáveis de ambiente para conectar com seu bucket S3:
          </p>

          <div className="space-y-2">
            <EnvVariable name="AWS_ACCESS_KEY_ID" />
            <EnvVariable name="AWS_SECRET_ACCESS_KEY" />
            <EnvVariable name="AWS_REGION" />
            <EnvVariable name="AWS_S3_BUCKET_NAME" />
          </div>
        </div>
      </div>

      {/* Features Card */}
      <div className="border-2 border-border rounded-sm bg-card">
        <div className="px-4 py-3 border-b-2 border-border bg-muted/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Funcionalidades
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <Feature icon={CheckCircle2} text="Drag & drop de múltiplos arquivos" />
          <Feature icon={CheckCircle2} text="Preview das imagens" />
          <Feature icon={CheckCircle2} text="Validação de tipo e tamanho" />
          <Feature icon={CheckCircle2} text="Barra de progresso" />
          <Feature icon={CheckCircle2} text="Pronto para integração AWS S3" />
        </div>
      </div>

      {/* API Endpoint Card */}
      <div className="border-2 border-border rounded-sm bg-card">
        <div className="px-4 py-3 border-b-2 border-border bg-muted/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Endpoint da API
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-sm">
              POST
            </span>
            <code className="text-foreground">/api/upload</code>
          </div>
          <p className="text-sm text-muted-foreground">
            Envia FormData com campo &quot;files&quot; contendo as imagens.
          </p>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="border-2 border-primary/30 rounded-sm bg-primary/5">
        <div className="px-4 py-3 border-b-2 border-primary/30 bg-primary/10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Próximos Passos
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <Step number={1} text="Configure as credenciais AWS" />
          <Step number={2} text="Crie um bucket S3" />
          <Step number={3} text="Configure as políticas CORS" />
          <Step number={4} text="Descomente o código S3 na API" />
        </div>
      </div>
    </div>
  )
}

function EnvVariable({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-sm">
      <Key className="w-4 h-4 text-primary shrink-0" />
      <code className="text-xs text-foreground break-all">{name}</code>
    </div>
  )
}

function Feature({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  text: string
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-primary shrink-0" />
      <span className="text-foreground">{text}</span>
    </div>
  )
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-sm flex items-center justify-center shrink-0">
        {number}
      </span>
      <span className="text-foreground">{text}</span>
    </div>
  )
}
