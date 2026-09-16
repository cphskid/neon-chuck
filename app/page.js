'use client'
import Link from 'next/link'

export default function Home() {
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
          width: 100%; max-width: 520px;
          background: rgba(255,255,255,0.92);
          border-radius: 28px;
          box-shadow: 0 12px 0 rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.15);
          padding: 32px 24px;
          text-align: center;
        }
        h1 { font-size: 2.2rem; color: #ff6f61; text-shadow: 2px 2px 0 #ffd166; margin-bottom: 10px; }
        .sub { color: #4a5568; font-size: 1rem; line-height: 1.7; margin-bottom: 24px; }
        .btn {
          display: inline-block; text-decoration: none; border: none; cursor: pointer;
          font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 1.3rem;
          color: #fff; background: linear-gradient(180deg, #ff9a56, #ff6f61);
          padding: 14px 36px; border-radius: 999px;
          box-shadow: 0 6px 0 #c94f3f;
        }
        .note {
          margin-top: 22px; font-size: 0.8rem; color: #a0aec0; line-height: 1.6;
        }
      `,
        }}
      />
      <div className="stage">
        <div className="panel">
          <h1>🎮 兒童英文遊戲平台</h1>
          <div className="sub">
            單人練習原型：字母 · 單字 · 填空 · 聽力，混合出題，用防禦戰的方式練英文！<br />
            （房間代碼 / 多人連線功能開發中）
          </div>
          <Link className="btn" href="/play">開始單人練習 →</Link>
          <div className="note">這是最小可玩原型，還沒有美術素材，先用 emoji 代替看看好不好玩 🙂</div>
        </div>
      </div>
    </>
  )
}
