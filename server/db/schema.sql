CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL CHECK (category IN ('еда', 'транспорт', 'развлечения', 'другое')),
  date TEXT NOT NULL,
  comment TEXT NOT NULL DEFAULT ''
);
