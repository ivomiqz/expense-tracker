import { Category, Expense, deleteExpense } from '../api/expenses'
import { useState } from 'react'

interface Props {
  expenses: Expense[]
  onDeleted: (id: number) => void
}

const categories: Array<Category | 'все'> = ['все', 'еда', 'транспорт', 'развлечения', 'другое']

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount)

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(`${date}T00:00:00`)
  )

export default function ExpenseList({ expenses, onDeleted }: Props) {
  const [filter, setFilter] = useState<Category | 'все'>('все')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const filteredExpenses =
    filter === 'все' ? expenses : expenses.filter((expense) => expense.category === filter)

  const handleDelete = async (id: number) => {
    setError('')
    try {
      setDeletingId(id)
      await deleteExpense(id)
      onDeleted(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить расход')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="card">
      <div className="section-heading list-heading">
        <div>
          <p className="eyebrow">История</p>
          <h2>Расходы</h2>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value as Category | 'все')}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="form-error">{error}</div>}

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">Расходов пока нет.</div>
      ) : (
        <div className="expense-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Категория</th>
                <th>Комментарий</th>
                <th>Сумма</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td><span className="category-badge">{expense.category}</span></td>
                  <td className="comment-cell">{expense.comment || '—'}</td>
                  <td className="amount-cell">{formatAmount(expense.amount)}</td>
                  <td>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                      aria-label={`Удалить расход ${expense.id}`}
                    >
                      {deletingId === expense.id ? '...' : 'Удалить'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
