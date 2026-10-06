const fs = require('fs')
const path = require('path')
const initSqlJs = require('sql.js')
require('dotenv').config()

const configuredPath = process.env.DATABASE_URL || './data/expenses.db'
const databasePath = path.isAbsolute(configuredPath)
  ? configuredPath
  : path.resolve(__dirname, '..', configuredPath)

fs.mkdirSync(path.dirname(databasePath), { recursive: true })

let db
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')

async function initializeDatabase() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(path.dirname(require.resolve('sql.js')), file)
  })

  db = fs.existsSync(databasePath)
    ? new SQL.Database(fs.readFileSync(databasePath))
    : new SQL.Database()

  db.run(schema)
  saveDatabase()
}

function saveDatabase() {
  fs.writeFileSync(databasePath, Buffer.from(db.export()))
}

function getAll(sql, params = []) {
  const statement = db.prepare(sql)
  statement.bind(params)
  const rows = []

  while (statement.step()) rows.push(statement.getAsObject())

  statement.free()
  return rows
}

function getOne(sql, params = []) {
  return getAll(sql, params)[0] || null
}

function run(sql, params = []) {
  db.run(sql, params)
  const row = getOne('SELECT last_insert_rowid() AS id')
  saveDatabase()
  return { lastInsertRowid: Number(row.id) }
}

function remove(sql, params = []) {
  db.run(sql, params)
  const row = getOne('SELECT changes() AS changes')
  saveDatabase()
  return { changes: Number(row.changes) }
}

module.exports = { initializeDatabase, getAll, getOne, run, remove }
