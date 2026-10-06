export type Category = 'еда' | 'транспорт' | 'развлечения' | 'другое'

export interface Expense {
  id: number
  amount: number
  category: Category
  date: string
  comment: string
}

export interface CreateExpense {
  amount: number
  category: Category
  date: string
  comment: string
}

const request = async <T,>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Не удалось выполнить запрос')
  }

  return payload
}

export const getExpenses = () => request<Expense[]>('/api/expenses')

export const createExpense = (expense: CreateExpense) =>
  request<Expense>('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense)
  })

export const deleteExpense = (id: number) =>
  request<{ message: string }>(`/api/expenses/${id}`, {
    method: 'DELETE'
  })
