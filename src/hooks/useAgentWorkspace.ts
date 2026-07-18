import { useEffect, useState } from 'react'
import { getAgentConversation, getAgentTasks, sendAgentPrompt } from '../services/agent'
import type { AgentMessage, AgentTask } from '../types/agent'

export function useAgentWorkspace() {
  const [tasks, setTasks] = useState<AgentTask[]>([])
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([getAgentTasks(), getAgentConversation()]).then(([t, m]) => {
      if (!alive) return
      setTasks(t)
      setMessages(m)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  async function submitPrompt() {
    const text = prompt.trim()
    if (!text || busy) return

    const userMessage: AgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setBusy(true)
    try {
      const reply = await sendAgentPrompt(text)
      setMessages((prev) => [...prev, reply])
    } finally {
      setBusy(false)
    }
  }

  return { tasks, messages, prompt, setPrompt, busy, loading, submitPrompt }
}
