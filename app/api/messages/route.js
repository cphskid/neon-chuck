import { createClient } from '@libsql/client/http'


function getClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

// 初始化資料表
async function initDB(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Chuck',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// GET - 取得所有訊息
export async function GET() {
  try {
    const client = getClient()
    await initDB(client)
    const result = await client.execute('SELECT * FROM messages ORDER BY created_at DESC LIMIT 20')
    return Response.json({ success: true, messages: result.rows })
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

// POST - 新增訊息
export async function POST(request) {
  try {
    const { content, author } = await request.json()
    if (!content) return Response.json({ success: false, error: 'content is required' }, { status: 400 })

    const client = getClient()
    await initDB(client)
    await client.execute({
      sql: 'INSERT INTO messages (content, author) VALUES (?, ?)',
      args: [content, author || 'Chuck'],
    })
    return Response.json({ success: true, message: 'Message saved!' })
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
