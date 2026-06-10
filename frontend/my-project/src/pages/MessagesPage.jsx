import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchConversations, fetchMessages, sendMessage } from '../services/messageApi'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim()

function displayName(user) {
  if (!user) return 'ผู้ใช้'
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return user.name || fullName || user.username || 'ผู้ใช้'
}

function initialsOf(user) {
  const name = displayName(user)
  return name.charAt(0).toUpperCase() || 'U'
}

export default function MessagesPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [myUserId, setMyUserId] = useState('')
  const [conversations, setConversations] = useState([])
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    fetch(`${apiUrl}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setMyUserId(data.user?._id || ''))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadingConversations(true)
    fetchConversations()
      .then((data) => {
        if (!cancelled) setConversations(data.conversations || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingConversations(false)
      })
    return () => { cancelled = true }
  }, [conversationId])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }

    let cancelled = false
    const load = () => {
      fetchMessages(conversationId)
        .then((data) => {
          if (!cancelled) setMessages(data.messages || [])
        })
        .catch((err) => {
          if (!cancelled) setError(err.message)
        })
    }

    load()
    const interval = setInterval(load, 4000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const activeConversation = conversations.find((c) => c._id === conversationId)
  const otherParticipant = activeConversation?.participants?.find((p) => p._id !== myUserId)

  async function handleSend(event) {
    event.preventDefault()
    if (!text.trim() || !conversationId) return
    setSending(true)
    setError('')
    try {
      await sendMessage(conversationId, text.trim())
      setText('')
      const data = await fetchMessages(conversationId)
      setMessages(data.messages || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="messages-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Messages</span>
          <h1>กล่องข้อความ</h1>
        </div>
      </div>

      <div className="messages-layout">
        <aside className="conversation-list">
          {loadingConversations ? (
            <div className="empty-state">กำลังโหลด...</div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">ยังไม่มีบทสนทนา</div>
          ) : (
            conversations.map((conv) => {
              const other = conv.participants?.find((p) => p._id !== myUserId)
              return (
                <button
                  key={conv._id}
                  className={`conversation-item ${conv._id === conversationId ? 'active' : ''}`}
                  onClick={() => navigate(`/messages/${conv._id}`)}
                >
                  <span className="poster-avatar">
                    {other?.avatar
                      ? <img src={other.avatar} alt={displayName(other)} />
                      : <span>{initialsOf(other)}</span>}
                  </span>
                  <span className="conversation-info">
                    <strong>{displayName(other)}</strong>
                    {conv.property?.title && <small>{conv.property.title}</small>}
                    <small className="conversation-preview">{conv.lastMessage || 'เริ่มการสนทนา'}</small>
                  </span>
                </button>
              )
            })
          )}
        </aside>

        <div className="conversation-thread">
          {!conversationId ? (
            <div className="empty-state">เลือกบทสนทนาเพื่อเริ่มแชท</div>
          ) : (
            <>
              <div className="thread-header">
                <span className="poster-avatar">
                  {otherParticipant?.avatar
                    ? <img src={otherParticipant.avatar} alt={displayName(otherParticipant)} />
                    : <span>{initialsOf(otherParticipant)}</span>}
                </span>
                <strong>{displayName(otherParticipant)}</strong>
              </div>

              <div className="thread-messages">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message-bubble ${msg.sender === myUserId ? 'mine' : 'theirs'}`}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {error && <div className="empty-state">{error}</div>}

              <form className="thread-composer" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความ..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  disabled={sending}
                />
                <button type="submit" className="primary-action" disabled={sending || !text.trim()}>
                  ส่ง
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
