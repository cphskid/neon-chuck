'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CLASSES, STORY, rollD6, computeEndingTier } from '../lib/gameData'

const STAT_LABEL = { str: '力量', wis: '智慧', agi: '敏捷' }

export default function Home() {
  const [phase, setPhase] = useState('menu')
  const [name, setName] = useState('')
  const [classId, setClassId] = useState(null)
  const [hero, setHero] = useState(null)
  const [sceneId, setSceneId] = useState('intro')
  const [hp, setHp] = useState(0)
  const [score, setScore] = useState(0)
  const [flags, setFlags] = useState({})
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)

  const startCreate = () => setPhase('create')

  const startAdventure = () => {
    const chosenClass = CLASSES.find((c) => c.id === classId)
    setHero(chosenClass)
    setHp(chosenClass.hp)
    setScore(0)
    setFlags({})
    setSceneId('intro')
    setResult(null)
    setPhase('play')
  }

  const chooseOption = (choice) => {
    if (choice.type === 'auto') {
      setResult({ text: choice.text, next: choice.next, scoreGain: choice.score || 0, flag: choice.flag })
      return
    }
    const statValue = hero[choice.stat]
    const roll = rollD6()
    const bonus = choice.bonusFlag && flags[choice.bonusFlag] ? 1 : 0
    const total = roll + statValue + bonus
    const success = total >= choice.difficulty
    setResult({
      roll,
      statValue,
      bonus,
      total,
      difficulty: choice.difficulty,
      statLabel: STAT_LABEL[choice.stat],
      success,
      text: success ? choice.successText : choice.failText,
      next: choice.next,
      scoreGain: success ? 1 : 0,
      hpLoss: !success ? choice.failHp || 0 : 0,
    })
  }

  const continueStory = async () => {
    if (!result) return
    const nextScore = score + (result.scoreGain || 0)
    const nextHp = Math.max(1, hp - (result.hpLoss || 0))
    const nextFlags = result.flag ? { ...flags, [result.flag]: true } : flags
    setScore(nextScore)
    setHp(nextHp)
    setFlags(nextFlags)
    setResult(null)

    if (result.next === 'ending') {
      setPhase('end')
      setSaving(true)
      const tier = computeEndingTier(nextScore)
      try {
        await fetch('/api/adventures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            heroName: name,
            className: hero.name,
            tierTitle: tier.title,
            score: nextScore,
          }),
        })
      } catch (e) {
        // saving is optional; the celebration still happens offline
      }
      setSaving(false)
    } else {
      setSceneId(result.next)
    }
  }

  const playAgain = () => {
    setPhase('menu')
    setName('')
    setClassId(null)
    setHero(null)
  }

  if (phase === 'menu') {
    return (
      <div className="wrap">
        <h1>🌲 小小勇者跑團 🐲</h1>
        <div className="subtitle">一場獻給孩子們的溫暖文字冒險</div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
            森林裡有一隻迷路的小龍，牠好想回家！
            <br />
            挑選一位小英雄，陪牠一起穿越森林，交到新朋友，完成一場溫馨的冒險吧！
          </p>
          <div className="btn-row">
            <button className="btn" onClick={startCreate}>
              🚀 開始新冒險
            </button>
            <Link className="btn btn-secondary" href="/records">
              📜 查看冒險紀錄
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'create') {
    return (
      <div className="wrap">
        <h1>✨ 建立你的小英雄</h1>
        <div className="card">
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>你的名字是？</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="輸入英雄的名字"
            maxLength={12}
          />
        </div>
        <div className="card">
          <label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>選擇你的職業</label>
          <div className="class-grid">
            {CLASSES.map((c) => (
              <button
                key={c.id}
                className={`class-card${classId === c.id ? ' selected' : ''}`}
                onClick={() => setClassId(c.id)}
              >
                <div className="emoji">{c.emoji}</div>
                <div className="name">{c.name}</div>
                <div className="desc">{c.desc}</div>
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button
              className="btn"
              disabled={!name.trim() || !classId}
              onClick={startAdventure}
            >
              🐲 出發尋找小龍的家！
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'play') {
    const scene = STORY[sceneId]
    return (
      <div className="wrap">
        <h1>🌲 小小勇者跑團 🐲</h1>
        <div className="statbar">
          <span className="stat-pill">{hero.emoji} {name}</span>
          <span className="stat-pill">❤️ HP {hp}</span>
          <span className="stat-pill">⭐ 友誼點數 {score}</span>
        </div>
        <div className="card">
          <div className="scene-emoji">{scene.emoji}</div>
          <div className="scene-text">{scene.text}</div>

          {!result &&
            scene.choices.map((choice, i) => (
              <button key={i} className="choice-btn" onClick={() => chooseOption(choice)}>
                {choice.label}
              </button>
            ))}

          {result && (
            <div className="result-box">
              {typeof result.roll === 'number' && (
                <p style={{ marginBottom: 8 }}>
                  🎲 骰子擲出 <span className="dice-roll">{result.roll}</span> 點！加上{' '}
                  {result.statLabel} {result.statValue}
                  {result.bonus ? ` + 松鼠夥伴加成 ${result.bonus}` : ''}，總共{' '}
                  <span className="dice-roll">{result.total}</span> 點（需要 {result.difficulty} 點）
                </p>
              )}
              <p style={{ marginBottom: 12 }}>{result.text}</p>
              <button className="btn" onClick={continueStory}>
                繼續冒險 ➡️
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'end') {
    const tier = computeEndingTier(score)
    return (
      <div className="wrap">
        <h1>🎉 冒險完成！</h1>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="scene-emoji">🏡🐲</div>
          <p style={{ marginBottom: 12, lineHeight: 1.7 }}>
            你和 {name} 終於把小龍送回了山谷裡的家，龍爸爸和龍媽媽感動得流下眼淚，緊緊擁抱著你們，
            並邀請大家一起參加森林裡最熱鬧的慶祝派對！
          </p>
          <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ff6b6b' }}>
            {tier.stars} {tier.title} {tier.stars}
          </p>
          <p style={{ marginBottom: 16 }}>友誼點數：⭐ {score}</p>
          {saving && <p style={{ color: '#999', fontSize: '0.85rem' }}>正在紀錄你的冒險...</p>}
          <div className="btn-row">
            <button className="btn" onClick={playAgain}>
              🔁 再玩一次
            </button>
            <Link className="btn btn-secondary" href="/records">
              📜 查看冒險紀錄
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
