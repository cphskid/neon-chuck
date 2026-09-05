import './globals.css'

export const metadata = {
  title: '小小勇者跑團',
  description: '一場獻給孩子們的溫暖文字跑團冒險 — 幫助迷路的小龍回家！',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
