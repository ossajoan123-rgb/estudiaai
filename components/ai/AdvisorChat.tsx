'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function AdvisorChat() {

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const [input, setInput] = useState('')

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '👋 Hola, soy tu asesor académico de EstudiaAI. ¿En qué puedo ayudarte hoy?',
    },
  ])

  async function sendMessage() {

    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])

    setInput('')

    setLoading(true)

    try {

      const res = await fetch('/api/ai', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          message: input,
        }),
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.message ||
            'No pude responder ahora.',
        },
      ])

    } catch {

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Ocurrió un error.',
        },
      ])
    }

    setLoading(false)
  }

  return (
    <>
      {/* Botón flotante */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg,#6366f1,#8b5cf6)',
          color: 'white',
        }}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Ventana */}

      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[360px] h-[600px] rounded-2xl overflow-hidden flex flex-col shadow-2xl border"
          style={{
            background: '#0f172a',
            borderColor: 'rgba(99,102,241,0.2)',
          }}
        >

          {/* Header */}

          <div
            className="p-4 border-b"
            style={{
              borderColor:
                'rgba(99,102,241,0.2)',
            }}
          >
            <h2
              className="font-bold text-lg"
              style={{ color: 'white' }}
            >
              Asesor EstudiaAI
            </h2>

            <p
              className="text-xs"
              style={{ color: '#94a3b8' }}
            >
              Tutor académico y emocional
            </p>
          </div>

          {/* Mensajes */}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map((m, i) => (

              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'ml-auto'
                    : 'mr-auto'
                }`}
                style={{
                  background:
                    m.role === 'user'
                      ? '#6366f1'
                      : '#1e293b',

                  color: 'white',
                }}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div
                className="p-3 rounded-2xl text-sm mr-auto"
                style={{
                  background: '#1e293b',
                  color: 'white',
                }}
              >
                Escribiendo...
              </div>
            )}
          </div>

          {/* Input */}

          <div
            className="p-3 border-t flex gap-2"
            style={{
              borderColor:
                'rgba(99,102,241,0.2)',
            }}
          >

            <input
              value={input}

              onChange={e =>
                setInput(e.target.value)
              }

              onKeyDown={e => {
                if (e.key === 'Enter') {
                  sendMessage()
                }
              }}

              placeholder="Escribe tu mensaje..."

              className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
              style={{
                background: '#1e293b',
                color: 'white',
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: 'white',
              }}
            >
              <Send className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}
    </>
  )
}