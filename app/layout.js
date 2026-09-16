export const metadata = {
  title: '兒童英文遊戲平台',
  description: '英文防禦戰 — 字母、單字、填空、聽力練習小遊戲',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
