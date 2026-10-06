import { FormEvent, useState } from 'react'
import { Category, CreateExpense, createExpense } from '../api/expenses'

interface Props {
  onCreated: (expense: Awaited<ReturnType<typeof createExpense>>) => void
}

const categories: Category[] = ['еда', 'транспорт', 'развлечения', 'другое']

const getToday = () => new Date().toISOString().slice(0, 10)

export default function ExpenseForm({ onCreated }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [date, setDate] = useState(getToday())
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    const numericAmount = Number(amount)

    if (!amount.trim()) {
      setError('Введите сумму')
      return
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Сумма должна быть больше нуля')
      return
    }

    if (!category) {
      setError('Выберите категорию')
      return
    }

    if (!date) {
      setError('Выберите дату')
      return
    }

    const payload: CreateExpense = {
      amount: numericAmount,
      category,
      date,
      comment: comment.trim()
    }

    try {
      setSaving(true)
      const created = await createExpense(payload)
      onCreated(created)
      setAmount('')
      setCategory('')
      setDate(getToday())
      setComment('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось добавить расход')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Новая запись</p>
          <h2>Добавить расход</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Сумма
          <input
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
          />
        </label>

        <label>
          Категория
          <select value={category} onChange={(event) => setCategory(event.target.value as Category | '')}>
            <option value="">Выберите категорию</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item[0].toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Дата
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <label className="full-width">
          Комментарий
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Необязательно"
            rows={3}
          />
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <button className="primary-button" type="submit" disabled={saving}>
        {saving ? 'Сохранение...' : 'Добавить расход'}
      </button>
    </form>
  )
}
