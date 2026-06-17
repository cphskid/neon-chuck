'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [author, setAuthor] = useState('Chuck')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const fetchMessages = async () => {
    const res = await fetch('/api/messages')
    const data = await res.json()
    if (data.success) setMessages(data.messages)
  }

  useEffect(() => { fetchMessages() }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    setLoading(true)
    setStatus('')
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input, author }),
    })
    const data = await res.json()
    if (data.success) {
      setStatus('✅ 已儲存到 Turso！')
      setInput('')
      fetchMessages()
    } else {
      setStatus('❌ 錯誤：' + data.error)
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #0a0a0f;
          min-height: 100vh;
          font-family: 'Orbitron', sans-serif;
          overflow-x: hidden;
        }
        .scanlines {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px);
          pointer-events: none; z-index: 0;
        }
        .container {
          position: relative; z-index: 1;
          max-width: 800px; margin: 0 auto;
          padding: 40px 20px; text-align: center;
        }
        .title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900; letter-spacing: 0.1em;
          line-height: 1.2; margin-bottom: 10px;
        }
        .hello { 
          color: #ff2d78;
          text-shadow: 0 0 10px #ff2d78, 0 0 30px #ff2d78, 0 0 60px #ff2d78, 0 0 100px #ff006e;
          animation: flicker1 3s infinite alternate;
        }
        .world { 
          color: #00f5ff;
          text-shadow: 0 0 10px #00f5ff, 0 0 30px #00f5ff, 0 0 60px #00f5ff, 0 0 100px #0066ff;
          animation: flicker2 2.5s infinite alternate;
        }
        .from {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: #ffd700;
          text-shadow: 0 0 10px #ffd700, 0 0 30px #ffd700, 0 0 60px #ff9500;
          letter-spacing: 0.3em;
          margin-bottom: 40px;
          animation: flicker3 4s infinite alternate;
        }
        .db-badge {
          display: inline-block;
          border: 1px solid #00f5ff;
          border-radius: 20px;
          padding: 5px 18px;
          font-size: 0.65rem;
          color: #00f5ff;
          box-shadow: 0 0 10px #00f5ff44;
          margin-bottom: 40px;
          letter-spacing: 0.2em;
        }
        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0,245,255,0.2);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 0 30px rgba(0,245,255,0.05);
        }
        .card h2 {
          color: #00f5ff;
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          margin-bottom: 20px;
          text-shadow: 0 0 10px #00f5ff;
        }
        .input-row {
          display: flex; gap: 10px; flex-wrap: wrap;
          justify-content: center; margin-bottom: 10px;
        }
        input {
          flex: 1; min-width: 200px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,45,120,0.4);
          border-radius: 8px;
          color: #fff;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          padding: 10px 16px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        input:focus {
          border-color: #ff2d78;
          box-shadow: 0 0 15px rgba(255,45,120,0.3);
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
        button {
          background: transparent;
          border: 1px solid #ff2d78;
          border-radius: 8px;
          color: #ff2d78;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          padding: 10px 24px;
          cursor: pointer;
          text-shadow: 0 0 10px #ff2d78;
          box-shadow: 0 0 15px rgba(255,45,120,0.2);
          transition: all 0.3s;
          letter-spacing: 0.1em;
        }
        button:hover {
          background: rgba(255,45,120,0.1);
          box-shadow: 0 0 25px rgba(255,45,120,0.5);
        }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        .status {
          font-size: 0.75rem;
          color: #ffd700;
          letter-spacing: 0.1em;
          min-height: 20px;
          margin-top: 5px;
        }
        .msg-list { text-align: left; }
        .msg-item {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 12px 0;
        }
        .msg-item:last-child { border-bottom: none; }
        .msg-content {
          color: #fff;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }
        .msg-meta {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
        }
        .msg-author { color: #ff2d78; text-shadow: 0 0 8px #ff2d78; }
        .empty { color: rgba(255,255,255,0.2); font-size: 0.8rem; padding: 20px; }
        @keyframes flicker1 {
          0%,95% { opacity: 1; } 96% { opacity: 0.8; } 97% { opacity: 1; } 98% { opacity: 0.6; } 100% { opacity: 1; }
        }
        @keyframes flicker2 {
          0%,90% { opacity: 1; } 91% { opacity: 0.7; } 92% { opacity: 1; } 98% { opacity: 0.9; } 100% { opacity: 1; }
        }
        @keyframes flicker3 {
          0%,97% { opacity: 1; } 98% { opacity: 0.5; } 99% { opacity: 1; } 100% { opacity: 0.9; }
        }
      `}</style>

      <div className="scanlines" />
      <div className="container">
        <div className="title">
          <span className="hello">HELLO </span>
          <span className="world">WORLD</span>
        </div>
        <div className="from">— FROM CHUCK —</div>
        <div className="db-badge">⚡ POWERED BY TURSO DATABASE</div>

        <div className="card">
          <h2>▌ 新增訊息到資料庫</h2>
          <div className="input-row">
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="作者"
              style={{ maxWidth: '150px', flex: 'none' }}
            />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="輸入你的訊息..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? 'SAVING...' : 'SEND'}
            </button>
          </div>
          <div className="status">{status}</div>
        </div>

        <div className="card">
          <h2>▌ 資料庫訊息紀錄</h2>
          <div className="msg-list">
            {messages.length === 0 ? (
              <div className="empty">尚無訊息 — 快來新增第一筆！</div>
            ) : messages.map((m, i) => (
              <div className="msg-item" key={i}>
                <div className="msg-content">{m.content}</div>
                <div className="msg-meta">
                  <span className="msg-author">{m.author}</span>
                  {' · '}{new Date(m.created_at).toLocaleString('zh-TW')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
