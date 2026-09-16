'use client'
import { useEffect, useReducer, useRef, useState } from 'react'
import { generateQuestion } from '../../lib/questions'

const TIME_PER_Q = 8000
const MONSTER_TIERS = [
  ['👾', '👻', '🐛'],
  ['👹', '🦂', '🕷️'],
  ['🐉', '👺', '🦇'],
]

const initialState = {
  phase: 'idle', // idle | playing | gameover
  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  xpNeeded: 50,
  score: 0,
  combo: 0,
  correctCount: 0,
  totalCount: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...initialState, phase: 'playing' }
    case 'CORRECT': {
      let xp = state.xp + 15
      let level = state.level
      let maxHp = state.maxHp
      let xpNeeded = state.xpNeeded
      let hp = state.hp
      while (xp >= xpNeeded) {
        xp -= xpNeeded
        level += 1
        maxHp += 10
        hp = Math.min(maxHp, hp + 20)
        xpNeeded = level * 50
      }
      const combo = state.combo + 1
      const score = state.score + 10 + Math.min(combo, 10) * 2
      return {
        ...state,
        xp,
        level,
        maxHp,
        hp,
        xpNeeded,
        combo,
        score,
        correctCount: state.correctCount + 1,
        totalCount: state.totalCount + 1,
      }
    }
    case 'WRONG': {
      const hp = Math.max(0, state.hp - 15)
      return {
        ...state,
        hp,
        combo: 0,
        totalCount: state.totalCount + 1,
        phase: hp <= 0 ? 'gameover' : state.phase,
      }
    }
    default:
      return state
  }
}

export default function PlayPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [question, setQuestion] = useState(null)
  const [monsterEmoji, setMonsterEmoji] = useState('👾')
  const [progress, setProgress] = useState(0)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [roundId, setRoundId] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [bestScore, setBestScore] = useState(0)

  const answeredRef = useRef(false)
  const timerRef = useRef(null)
  const prevLevelRef = useRef(1)

  useEffect(() => {
    try {
      setBestScore(Number(localStorage.getItem('nc_best_score') || 0))
    } catch {}
  }, [])

  useEffect(() => {
    if (state.phase !== 'playing') return
    const q = generateQuestion()
    setQuestion(q)
    setFeedback(null)
    answeredRef.current = false
    setProgress(0)

    const tier = MONSTER_TIERS[Math.min(Math.floor((state.level - 1) / 3), 2)]
    setMonsterEmoji(tier[Math.floor(Math.random() * tier.length)])

    if (q.type === 'listening' && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(q.speak)
      utter.lang = 'en-US'
      utter.rate = 0.85
      window.speechSynthesis.speak(utter)
    }

    const start = Date.now()
    timerRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / TIME_PER_Q)
      setProgress(p)
      if (p >= 1 && !answeredRef.current) {
        resolveAnswer(false)
      }
    }, 100)

    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, roundId])

  useEffect(() => {
    if (state.level > prevLevelRef.current) {
      setShowLevelUp(true)
      const t = setTimeout(() => setShowLevelUp(false), 1600)
      prevLevelRef.current = state.level
      return () => clearTimeout(t)
    }
    prevLevelRef.current = state.level
  }, [state.level])

  useEffect(() => {
    if (state.phase === 'gameover') {
      try {
        const prev = Number(localStorage.getItem('nc_best_score') || 0)
        if (state.score > prev) {
          localStorage.setItem('nc_best_score', String(state.score))
          setBestScore(state.score)
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase])

  function resolveAnswer(isCorrect) {
    if (answeredRef.current) return
    answeredRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    const willGameOver = !isCorrect && state.hp - 15 <= 0
    dispatch({ type: isCorrect ? 'CORRECT' : 'WRONG' })
    if (!willGameOver) {
      setTimeout(() => setRoundId((id) => id + 1), 900)
    }
  }

  const castleEmoji = state.level < 3 ? '🏰' : state.level < 6 ? '🏯' : '🏛️'
  const accuracy = state.totalCount > 0 ? Math.round((state.correctCount / state.totalCount) * 100) : 0

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Baloo 2', sans-serif; }
        .stage {
          min-height: 100vh;
          background: linear-gradient(180deg, #7ec8f2 0%, #a8ddf0 45%, #bdeaa0 46%, #8fd67a 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .panel {
          width: 100%; max-width: 640px;
          background: rgba(255,255,255,0.9);
          border-radius: 28px;
          box-shadow: 0 12px 0 rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.15);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        h1 { text-align: center; font-size: 2rem; color: #ff6f61; text-shadow: 2px 2px 0 #ffd166; margin-bottom: 6px; }
        .sub { text-align: center; color: #4a5568; font-size: 1rem; margin-bottom: 18px; }
        .btn {
          display: block; margin: 0 auto; border: none; cursor: pointer;
          font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 1.3rem;
          color: #fff; background: linear-gradient(180deg, #ff9a56, #ff6f61);
          padding: 14px 36px; border-radius: 999px;
          box-shadow: 0 6px 0 #c94f3f;
          transition: transform 0.1s;
        }
        .btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #c94f3f; }
        .best { text-align: center; margin-top: 14px; color: #718096; font-size: 0.95rem; }

        .hud { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .stat { font-weight: 700; font-size: 0.95rem; color: #2d3748; }
        .bar-wrap { flex: 1; min-width: 140px; }
        .bar-label { font-size: 0.7rem; font-weight: 700; color: #4a5568; margin-bottom: 2px; }
        .bar-bg { background: #e2e8f0; border-radius: 999px; height: 14px; overflow: hidden; border: 2px solid #cbd5e0; }
        .bar-hp { height: 100%; background: linear-gradient(90deg, #48bb78, #f6e05e, #f56565); transition: width 0.3s; }
        .bar-xp { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s; }

        .battlefield {
          position: relative; height: 160px; margin-bottom: 16px;
          background: linear-gradient(180deg, #cdeffd 0%, #d9f4bd 100%);
          border-radius: 18px; border: 3px solid #ffffffaa;
          overflow: hidden;
        }
        .castle { position: absolute; left: 14px; bottom: 10px; font-size: 3.2rem; transition: transform 0.15s; }
        .castle.hit { animation: shake 0.4s; }
        .lane { position: absolute; left: 90px; right: 20px; bottom: 24px; height: 6px; background: #ffffff77; border-radius: 3px; }
        .monster {
          position: absolute; bottom: 22px; font-size: 3rem;
          transition: left 0.1s linear;
        }
        .monster.correct { animation: pop 0.5s forwards; }
        .monster.wrong { animation: none; }
        .timebar-wrap { position: absolute; top: 8px; left: 90px; right: 20px; height: 8px; background: #ffffff88; border-radius: 4px; overflow: hidden; }
        .timebar { height: 100%; background: linear-gradient(90deg, #48bb78, #f56565); transition: width 0.1s linear; }
        .combo { position: absolute; top: 10px; left: 12px; font-weight: 800; color: #ff6f61; font-size: 0.85rem; }
        .levelup {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          font-size: 1.6rem; font-weight: 800; color: #d69e2e; text-shadow: 2px 2px 0 #fff;
          animation: pop 1.4s ease-out;
        }
        .boom { position: absolute; font-size: 3.5rem; animation: pop 0.5s forwards; }

        .question-card { text-align: center; margin-bottom: 16px; }
        .question-title { font-size: 1.1rem; font-weight: 700; color: #2d3748; margin-bottom: 8px; }
        .question-emoji { font-size: 3.5rem; }

        .options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .option-btn {
          border: none; cursor: pointer; border-radius: 16px; padding: 18px 10px;
          font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 1.3rem; color: #fff;
          box-shadow: 0 5px 0 rgba(0,0,0,0.15);
          transition: transform 0.08s;
        }
        .option-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.15); }
        .option-btn:disabled { opacity: 0.6; cursor: default; }
        .opt-0 { background: #f56565; }
        .opt-1 { background: #4299e1; }
        .opt-2 { background: #48bb78; }
        .opt-3 { background: #ecc94b; }

        .gameover { text-align: center; }
        .gameover h2 { font-size: 1.8rem; color: #e53e3e; margin-bottom: 12px; }
        .summary { font-size: 1rem; color: #2d3748; line-height: 1.8; margin-bottom: 18px; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 1; }
          60% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `,
        }}
      />

      <div className="stage">
        <div className="panel">
          {state.phase === 'idle' && (
            <>
              <h1>🏰 英文防禦戰 🛡️</h1>
              <div className="sub">怪物帶著英文題目來了！答對就擊退它，答錯城堡會受傷。<br />字母 · 單字 · 填空 · 聽力，混合出題！</div>
              <button className="btn" onClick={() => dispatch({ type: 'START' })}>開始遊戲</button>
              {bestScore > 0 && <div className="best">🏆 最高分：{bestScore}</div>}
            </>
          )}

          {state.phase === 'playing' && question && (
            <>
              <div className="hud">
                <div className="stat">💗 Lv.{state.level}</div>
                <div className="bar-wrap">
                  <div className="bar-label">HP {state.hp}/{state.maxHp}</div>
                  <div className="bar-bg"><div className="bar-hp" style={{ width: `${(state.hp / state.maxHp) * 100}%` }} /></div>
                </div>
                <div className="bar-wrap">
                  <div className="bar-label">XP {state.xp}/{state.xpNeeded}</div>
                  <div className="bar-bg"><div className="bar-xp" style={{ width: `${(state.xp / state.xpNeeded) * 100}%` }} /></div>
                </div>
                <div className="stat">⭐ {state.score}</div>
              </div>

              <div className="battlefield">
                {state.combo >= 2 && <div className="combo">🔥 Combo x{state.combo}</div>}
                <div className="timebar-wrap"><div className="timebar" style={{ width: `${(1 - progress) * 100}%` }} /></div>
                <div className={`castle ${feedback === 'wrong' ? 'hit' : ''}`}>{castleEmoji}</div>
                <div className="lane" />
                {feedback !== 'correct' && (
                  <div className="monster" style={{ left: `${90 - progress * 72}%` }}>{monsterEmoji}</div>
                )}
                {feedback === 'correct' && <div className="boom" style={{ left: `${90 - progress * 72}%` }}>💥</div>}
                {feedback === 'wrong' && <div className="boom" style={{ left: `${90 - progress * 72}%` }}>💢</div>}
                {showLevelUp && <div className="levelup">🎉 升級啦！Lv.{state.level}</div>}
              </div>

              <div className="question-card">
                <div className="question-title">{question.title}</div>
                {question.promptEmoji && <div className="question-emoji">{question.promptEmoji}</div>}
              </div>

              <div className="options">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn opt-${i}`}
                    disabled={answeredRef.current}
                    onClick={() => resolveAnswer(opt.correct)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {state.phase === 'gameover' && (
            <div className="gameover">
              <h2>💥 城堡淪陷了！</h2>
              <div className="summary">
                最終分數：<b>{state.score}</b><br />
                到達等級：<b>Lv.{state.level}</b><br />
                答對題數：<b>{state.correctCount} / {state.totalCount}</b>（正確率 {accuracy}%）<br />
                {state.score >= bestScore && state.score > 0 && '🏆 新紀錄！'}
              </div>
              <button className="btn" onClick={() => dispatch({ type: 'START' })}>再玩一次</button>
              <div className="best">🏆 最高分：{Math.max(bestScore, state.score)}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
