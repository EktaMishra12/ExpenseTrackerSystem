import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const AddExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addExpense, updateExpense, getExpenseById, loading } = useExpense();

  const isEditing = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '' // Added category field
  });

  const [errors, setErrors] = useState({});

  // Predefined categories
  const categories = [
    'Food',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Others'
  ];

  useEffect(() => {
    const fetchExpense = async () => {
      if (isEditing && id) {
        try {
          const expense = await getExpenseById(id);
          if (expense) {
            setFormData({
              title: expense.title,
              amount: expense.amount.toString(),
              date: new Date(expense.date).toISOString().split('T')[0],
              description: expense.description || '',
              category: expense.category || ''
            });
          }
        } catch (error) {
          console.error('Failed to fetch expense:', error);
        }
      }
    };

    fetchExpense();
  }, [id, isEditing, getExpenseById]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const expenseData = {
      ...formData,
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      description: formData.description.trim()
    };

    try {
      if (isEditing) {
        await updateExpense(id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigate('/expenses');
    } catch (error) {
      console.error('Error saving expense:', error.response?.data || error.message);
      alert('Failed to save expense. Please check console for details.');
    }
  };

  return (
    <div className="add-expense-page">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/expenses')}>
          Back to Expenses
        </button>
        <h1 className="text-3xl font-bold">
          {isEditing ? '✏ Edit Expense' : '➕ Add New Expense'}
        </h1>
      </div>

      <div className="form-container">
        <div className="form-card card">
          <div className="card-header">
            <h2 className="card-title">
              {isEditing ? '📝 Update Expense Details' : '💰 Enter Expense Details'}
            </h2>
            <p className="card-subtitle">
              {isEditing
                ? 'Modify the expense information below'
                : 'Fill in the information about your expense'}
            </p>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-grid grid grid-2">
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">💡 Title *</label>
                  <input
                    type="text"
                    name="title"
                    className={`form-control ${errors.title ? 'error' : ''}`}
                    placeholder="e.g., Grocery shopping"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                {/* Amount */}
                <div className="form-group">
                  <label className="form-label">💵 Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.amount ? 'error' : ''}`}
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                  {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label">📅 Date *</label>
                  <input
                    type="date"
                    name="date"
                    className={`form-control ${errors.date ? 'error' : ''}`}
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">🏷️ Category *</label>
                  <select
                    name="category"
                    className={`form-control ${errors.category ? 'error' : ''}`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">📝 Description (Optional)</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Add any additional details..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/expenses')}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '💾 Saving...' : isEditing ? '✅ Update Expense' : '💾 Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
