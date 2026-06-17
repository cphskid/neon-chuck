export const metadata = {
  title: 'Neon Chuck',
  description: 'Hello World from Chuck — powered by Turso',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
