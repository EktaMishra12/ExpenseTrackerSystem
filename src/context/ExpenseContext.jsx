import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseContext = createContext();

const API_BASE = import.meta.env.VITE_BACKEND_URL ||'http://localhost:5000/api/expenses';

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch all expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add expense
  const addExpense = async (expenseData) => {
    try {
      setLoading(true);
      const response = await axios.post(API_BASE, expenseData);
      setExpenses(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to add expense');
      console.error('Error adding expense:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update expense
  const updateExpense = async (id, expenseData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE}/${id}`, expenseData);
      setExpenses(prev =>
        prev.map(exp => exp._id === id ? response.data : exp)
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to update expense');
      console.error('Error updating expense:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete expense
  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/${id}`);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete expense');
      console.error('Error deleting expense:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get single expense
  const getExpenseById = (id) => {
    return expenses.find(expense => expense._id === id);
  };

  // Load expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const value = {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchExpenses,
    getExpenseById
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
