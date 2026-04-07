import { NextRequest, NextResponse } from "next/server"

// Configuração para AWS S3
// Você precisará instalar: npm install @aws-sdk/client-s3
// E configurar as variáveis de ambiente:
// - AWS_ACCESS_KEY_ID
// - AWS_SECRET_ACCESS_KEY
// - AWS_REGION
// - AWS_S3_BUCKET_NAME

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    // Validação dos arquivos
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de arquivo não permitido: ${file.type}` },
          { status: 400 }
        )
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Arquivo muito grande: ${file.name}` },
          { status: 400 }
        )
      }
    }

    // ============================================
    // INTEGRAÇÃO COM AWS S3
    // Descomente o código abaixo após configurar AWS
    // ============================================

    /*
    import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    const uploadedFiles = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = `${Date.now()}-${file.name}`

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        // ACL: "public-read", // Se quiser que o arquivo seja público
      })

      await s3Client.send(command)

      uploadedFiles.push({
        name: file.name,
        key: fileName,
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Arquivos enviados com sucesso para S3",
      files: uploadedFiles,
    })
    */

    // ============================================
    // RESPOSTA DE DEMONSTRAÇÃO (remover após integrar AWS)
    // ============================================

    const uploadedFiles = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      key: `demo-${Date.now()}-${file.name}`,
      url: `https://your-bucket.s3.region.amazonaws.com/demo-${Date.now()}-${file.name}`,
    }))

    // Simula delay de upload
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Arquivos processados com sucesso (modo demo)",
      files: uploadedFiles,
    })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// Configuração para permitir arquivos maiores
export const config = {
  api: {
    bodyParser: false,
  },
}
