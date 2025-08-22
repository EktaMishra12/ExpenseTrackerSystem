import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file path
const dataFilePath = path.join(__dirname, 'data', 'expenses.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
}

// Helper functions
const readExpenses = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeExpenses = (expenses) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2));
};

// Routes
app.get('/api/expenses', (req, res) => {
  try {
    const expenses = readExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', (req, res) => {
  try {
    const expenses = readExpenses();
    const newExpense = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    writeExpenses(expenses);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.put('/api/expenses/:id', (req, res) => {
  try {
    const expenses = readExpenses();
    const expenseIndex = expenses.findIndex(exp => exp.id === req.params.id);
    
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    expenses[expenseIndex] = { ...expenses[expenseIndex], ...req.body };
    writeExpenses(expenses);
    res.json(expenses[expenseIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  try {
    const expenses = readExpenses();
    const filteredExpenses = expenses.filter(exp => exp.id !== req.params.id);
    
    if (expenses.length === filteredExpenses.length) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    writeExpenses(filteredExpenses);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

app.get('/api/categories', (req, res) => {
  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Personal Care',
    'Other'
  ];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});