import { NextResponse } from "next/server"
import { openai } from "../../../lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
Eres un tutor académico y emocional.
Ayudas estudiantes universitarios.
Das respuestas cortas, útiles y prácticas.
`,
        },
        {
          role: "user",
          content: body.message,
        },
      ],
    })

    return NextResponse.json({
      message:
        completion.choices[0].message.content,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error con OpenAI" },
      { status: 500 }
    )
  }
}