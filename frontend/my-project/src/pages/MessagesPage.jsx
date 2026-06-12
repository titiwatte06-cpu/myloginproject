import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchConversations, fetchMessages, sendMessage } from '../services/messageApi'
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService'
import { apiUrl } from '../config/api.js'

const TYPING_TIMEOUT = 2000

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
  const [onlineUserIds, setOnlineUserIds] = useState(new Set())
  const [unreadCounts, setUnreadCounts] = useState({})
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

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
  }, [])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }

    let cancelled = false
    fetchMessages(conversationId)
      .then((data) => {
        if (!cancelled) setMessages(data.messages || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => { cancelled = true }
  }, [conversationId])

  // Reset unread count / typing state when switching conversations
  useEffect(() => {
    setIsOtherTyping(false)
    if (!conversationId) return
    setUnreadCounts((prev) => {
      if (!prev[conversationId]) return prev
      const next = { ...prev }
      delete next[conversationId]
      return next
    })
  }, [conversationId])

  // Connect socket and wire up real-time events
  useEffect(() => {
    if (!myUserId) return

    const socket = connectSocket()

    const handleNewMessage = ({ conversationId: cid, message }) => {
      if (cid === conversationId) {
        setMessages((prev) => [...prev, message])
        if (message.sender !== myUserId) setIsOtherTyping(false)
      } else if (message.sender !== myUserId) {
        setUnreadCounts((prev) => ({ ...prev, [cid]: (prev[cid] || 0) + 1 }))
      }
    }

    const handleConversationUpdated = ({ conversationId: cid, lastMessage, lastMessageAt }) => {
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv._id === cid ? { ...conv, lastMessage, lastMessageAt } : conv
        )
        return [...updated].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      })
    }

    const handlePresence = ({ userId, online }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev)
        if (online) next.add(userId)
        else next.delete(userId)
        return next
      })
    }

    const handleTyping = ({ conversationId: cid }) => {
      if (cid === conversationId) setIsOtherTyping(true)
    }

    const handleStopTyping = ({ conversationId: cid }) => {
      if (cid === conversationId) setIsOtherTyping(false)
    }

    socket.on('new-message', handleNewMessage)
    socket.on('conversation-updated', handleConversationUpdated)
    socket.on('presence', handlePresence)
    socket.on('typing', handleTyping)
    socket.on('stop-typing', handleStopTyping)

    return () => {
      socket.off('new-message', handleNewMessage)
      socket.off('conversation-updated', handleConversationUpdated)
      socket.off('presence', handlePresence)
      socket.off('typing', handleTyping)
      socket.off('stop-typing', handleStopTyping)
    }
  }, [myUserId, conversationId])

  useEffect(() => {
    return () => disconnectSocket()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const activeConversation = conversations.find((c) => c._id === conversationId)
  const otherParticipant = activeConversation?.participants?.find((p) => p._id !== myUserId)

  function handleTextChange(event) {
    setText(event.target.value)
    if (!conversationId) return

    const socket = getSocket()
    if (!socket) return

    socket.emit('typing', { conversationId })
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { conversationId })
    }, TYPING_TIMEOUT)
  }

  async function handleSend(event) {
    event.preventDefault()
    if (!text.trim() || !conversationId) return
    setSending(true)
    setError('')

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    getSocket()?.emit('stop-typing', { conversationId })

    try {
      await sendMessage(conversationId, text.trim())
      setText('')
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
              const unread = unreadCounts[conv._id]
              return (
                <button
                  key={conv._id}
                  className={`conversation-item ${conv._id === conversationId ? 'active' : ''}`}
                  onClick={() => navigate(`/messages/${conv._id}`)}
                >
                  <span className="poster-avatar avatar-with-status">
                    {other?.avatar
                      ? <img src={other.avatar} alt={displayName(other)} />
                      : <span>{initialsOf(other)}</span>}
                    {other?._id && onlineUserIds.has(other._id) && <span className="online-dot" />}
                  </span>
                  <span className="conversation-info">
                    <strong>{displayName(other)}</strong>
                    {conv.property?.title && <small>{conv.property.title}</small>}
                    <small className="conversation-preview">{conv.lastMessage || 'เริ่มการสนทนา'}</small>
                  </span>
                  {!!unread && <span className="unread-badge">{unread}</span>}
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
                <span className="poster-avatar avatar-with-status">
                  {otherParticipant?.avatar
                    ? <img src={otherParticipant.avatar} alt={displayName(otherParticipant)} />
                    : <span>{initialsOf(otherParticipant)}</span>}
                  {otherParticipant?._id && onlineUserIds.has(otherParticipant._id) && <span className="online-dot" />}
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

              {isOtherTyping && <div className="typing-indicator">กำลังพิมพ์...</div>}
              {error && <div className="empty-state">{error}</div>}

              <form className="thread-composer" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความ..."
                  value={text}
                  onChange={handleTextChange}
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
