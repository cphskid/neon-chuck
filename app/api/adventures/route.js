import { createClient } from '@libsql/client/http'

function getClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

async function initDB(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS adventures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hero_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      tier_title TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function GET() {
  try {
    const client = getClient()
    await initDB(client)
    const result = await client.execute(
      'SELECT * FROM adventures ORDER BY created_at DESC LIMIT 20'
    )
    return Response.json({ success: true, adventures: result.rows })
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { heroName, className, tierTitle, score } = await request.json()
    if (!heroName || !className || !tierTitle) {
      return Response.json({ success: false, error: 'missing fields' }, { status: 400 })
    }

    const client = getClient()
    await initDB(client)
    await client.execute({
      sql: 'INSERT INTO adventures (hero_name, class_name, tier_title, score) VALUES (?, ?, ?, ?)',
      args: [heroName, className, tierTitle, score || 0],
    })
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
