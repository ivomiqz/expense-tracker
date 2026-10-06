const express = require('express')
const db = require('../db')

const router = express.Router()
const categories = new Set(['еда', 'транспорт', 'развлечения', 'другое'])
const datePattern = /^\d{4}-\d{2}-\d{2}$/

router.get('/', (req, res) => {
  try {
    res.json(db.getAll('SELECT id, amount, category, date, comment FROM expenses ORDER BY date DESC, id DESC'))
  } catch {
    res.status(500).json({ error: 'Не удалось загрузить расходы' })
  }
})

router.post('/', (req, res) => {
  try {
    const { amount, category, date, comment = '' } = req.body
    if (amount === undefined || amount === null || amount === '') return res.status(400).json({ error: 'Сумма обязательна' })
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return res.status(400).json({ error: 'Сумма должна быть больше нуля' })
    if (!categories.has(category)) return res.status(400).json({ error: 'Выберите корректную категорию' })
    if (typeof date !== 'string' || !datePattern.test(date)) return res.status(400).json({ error: 'Дата обязательна и должна быть корректной' })
    if (typeof comment !== 'string') return res.status(400).json({ error: 'Некорректный комментарий' })

    const result = db.run(
      'INSERT INTO expenses (amount, category, date, comment) VALUES (?, ?, ?, ?)',
      [numericAmount, category, date, comment.trim()]
    )

    res.status(201).json(db.getOne(
      'SELECT id, amount, category, date, comment FROM expenses WHERE id = ?',
      [result.lastInsertRowid]
    ))
  } catch {
    res.status(500).json({ error: 'Не удалось добавить расход' })
  }
})

router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Некорректный идентификатор' })
    if (!db.getOne('SELECT id FROM expenses WHERE id = ?', [id])) return res.status(404).json({ error: 'Расход не найден' })
    db.remove('DELETE FROM expenses WHERE id = ?', [id])
    res.json({ message: 'Расход удалён' })
  } catch {
    res.status(500).json({ error: 'Не удалось удалить расход' })
  }
})

module.exports = router
