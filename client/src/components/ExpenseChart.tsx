import { Expense } from '../api/expenses'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface Props {
  expenses: Expense[]
}

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'short',
  year: 'numeric'
})

export default function ExpenseChart({ expenses }: Props) {
  const grouped = expenses.reduce<Record<string, number>>((result, expense) => {
    const key = expense.date.slice(0, 7)
    result[key] = (result[key] || 0) + expense.amount
    return result
  }, {})

  const data = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month: monthFormatter.format(new Date(`${month}-01T00:00:00`)),
      amount: Number(amount.toFixed(2))
    }))

  return (
    <section className="card chart-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Аналитика</p>
          <h2>Расходы по месяцам</h2>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">Добавьте расходы, чтобы увидеть график.</div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} ₽`, 'Расходы']} />
              <Bar dataKey="amount" name="Расходы" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
