import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
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


  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}expenses/categories`);
      setCategories(response.data);
    } catch (err) {
      console.warn('⚠️ No /categories endpoint yet, skipping...');
    }
  };


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


  const getExpenseById = (id) => {
    return expenses.find(expense => expense._id === id);
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const value = {
    expenses,
    categories,
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
