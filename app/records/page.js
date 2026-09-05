'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Records() {
  const [adventures, setAdventures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/adventures')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAdventures(data.adventures)
        else setError(data.error)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="wrap">
      <Link className="back-link" href="/">
        ← 回到首頁
      </Link>
      <h1>📜 冒險紀錄</h1>
      <div className="subtitle">看看有哪些小英雄幫小龍找到了家</div>
      <div className="card">
        {loading && <div className="empty">載入中...</div>}
        {error && <div className="empty">讀取失敗：{error}</div>}
        {!loading && !error && adventures.length === 0 && (
          <div className="empty">還沒有冒險紀錄，快去開始第一場冒險吧！</div>
        )}
        {!loading &&
          !error &&
          adventures.map((a) => (
            <div className="record-item" key={a.id}>
              <span>
                <strong>{a.hero_name}</strong>（{a.class_name}）
              </span>
              <span>
                {a.tier_title} ⭐{a.score}
              </span>
              <span style={{ color: '#999', fontSize: '0.8rem' }}>
                {new Date(a.created_at).toLocaleString('zh-TW')}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
