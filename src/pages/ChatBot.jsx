// src/pages/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente de canto. Dime tu nivel y qué quieres mejorar (respiración, resonancia, afinación, rango, etc.).",
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt:
            "Eres un coach vocal profesional. Das consejos prácticos, ejemplos de ejercicios y progresiones por nivel. Respondes en español.",
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await resp.json();
      const reply = data?.reply || "Lo siento, no pude generar una respuesta.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ocurrió un error al conectar con la IA. Intenta de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-white/40 overflow-hidden">
        {/* Header */}
        <div className="bg-violet-600 text-white px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">🎤</div>
          <h1 className="text-lg font-semibold">Asistente de Clases de Canto</h1>
        </div>

        {/* Mensajes */}
        <div className="h-[60vh] overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="w-9 h-9 rounded-full bg-gray-200 mr-2 flex items-center justify-center shadow">
                    🎧
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow transition
                    ${isUser ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-900"}
                  `}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
                {isUser && (
                  <div className="w-9 h-9 rounded-full bg-violet-200 ml-2 flex items-center justify-center shadow">
                    🙂 
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500 px-2">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300"></span>
              <span className="text-sm">El asistente está pensando…</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white/70 p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Escribe tu objetivo (p. ej., mejorar respiración) y pulsa Enter…"
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-xl px-4 py-2 bg-violet-600 text-white font-medium shadow hover:bg-violet-700 disabled:opacity-50 transition"
            >
              Enviar
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Consejito: incluye tu **nivel** (principiante/intermedio/avanzado) y tu **rango actual** si lo conoces.
          </p>
        </div>
      </div>
    </div>
  );
}
