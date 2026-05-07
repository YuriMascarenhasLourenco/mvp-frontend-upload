import { CheckCircle2, Code, Database, Key, Server } from "lucide-react"

export function UploadInstructions() {
  return (
    <div className="space-y-6">

      {/* Features Card */}
      <div className="border-2 border-border rounded-sm bg-card">
        <div className="px-4 py-3 border-b-2 border-border bg-muted/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Functionalities
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <Feature icon={CheckCircle2} text="Drag & drop of multiples arquives" />
          <Feature icon={CheckCircle2} text="Images preview" />
          <Feature icon={CheckCircle2} text="Validation of file type and size" />
          <Feature icon={CheckCircle2} text="Progress bar" />
          <Feature icon={CheckCircle2} text="Integration with AWS S3, Lambda, CloudFront and API Gateway" />
        </div>
      </div>

      {/* API Endpoint Card */}
      <div className="border-2 border-border rounded-sm bg-card">
        <div className="px-4 py-3 border-b-2 border-border bg-muted/50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            API Endpoint
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
            Sends FormData with a &quot;files&quot; field containing the images.
          </p>
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
