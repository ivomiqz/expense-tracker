const express = require('express')
const cors = require('cors')
require('dotenv').config()

const db = require('./db')
const expensesRouter = require('./routes/expenses')

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(cors())
app.use(express.json())
app.use('/api/expenses', expensesRouter)

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Внутренняя ошибка сервера' })
})

async function start() {
  try {
    await db.initializeDatabase()
    app.listen(port, () => console.log(`Server listening on port ${port}`))
  } catch (error) {
    console.error('Database initialization failed:', error)
    process.exit(1)
  }
}

start()
