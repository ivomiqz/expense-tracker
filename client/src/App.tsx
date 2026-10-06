import { useEffect, useMemo, useState } from 'react'
import { Expense, getExpenses } from './api/expenses'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseChart from './components/ExpenseChart'

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount)

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getExpenses()
        setExpenses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить расходы')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  )

  const handleCreated = (expense: Expense) => {
    setExpenses((current) => [expense, ...current])
    setError('')
  }

  const handleDeleted = (id: number) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Личный бюджет</p>
          <h1>Expense Tracker</h1>
          <p className="hero-copy">Учитывайте расходы и следите за динамикой трат.</p>
        </div>
        <div className="total-card">
          <span>Всего расходов</span>
          <strong>{formatAmount(total)}</strong>
        </div>
      </header>

      {error && (
        <div className="api-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => window.location.reload()}>
            Повторить
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state" aria-live="polite">
          <span className="spinner" />
          <span>Загрузка расходов...</span>
        </div>
      ) : (
        <>
          <div className="top-grid">
            <ExpenseForm onCreated={handleCreated} />
            <ExpenseChart expenses={expenses} />
          </div>
          <ExpenseList expenses={expenses} onDeleted={handleDeleted} />
        </>
      )}
    </main>
  )
}
