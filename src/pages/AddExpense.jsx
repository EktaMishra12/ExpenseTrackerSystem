import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import { ArrowLeft, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

const AddExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addExpense, updateExpense, getExpenseById, categories, loading } = useExpense();

  const isEditing = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && id) {
      const expense = getExpenseById(id);
      if (expense) {
        setFormData({
          title: expense.title,
          amount: expense.amount.toString(),
          category: expense.category,
          date: new Date(expense.date).toISOString().split('T')[0],
          description: expense.description || ''
        });
      }
    }
  }, [id, isEditing, getExpenseById]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const expenseData = {
        ...formData,
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        description: formData.description.trim()
      };

      if (isEditing) {
        await updateExpense(id, expenseData);
      } else {
        await addExpense(expenseData);
      }

      navigate('/expenses');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <div className="add-expense-page">
      <div className="page-header">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/expenses')}
        >
          <ArrowLeft size={18} />
          Back to Expenses
        </button>

        <h1 className="text-3xl font-bold">
          {isEditing ? '✏️ Edit Expense' : '➕ Add New Expense'}
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
                : 'Fill in the information about your expense with beautiful details'}
            </p>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-grid grid grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <FileText size={16} />
                    💡 Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`form-control ${errors.title ? 'error' : ''}`}
                    placeholder="e.g., Grocery shopping"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <span className="error-message">{errors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={16} />
                    💵 Amount *
                  </label>
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
                  {errors.amount && (
                    <span className="error-message">{errors.amount}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Tag size={16} />
                    🏷️ Category *
                  </label>
                  <select
                    name="category"
                    className={`form-control ${errors.category ? 'error' : ''}`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="error-message">{errors.category}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    📅 Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    className={`form-control ${errors.date ? 'error' : ''}`}
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {errors.date && (
                    <span className="error-message">{errors.date}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">📝 Description (Optional)</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Add any additional details about this expense... ✨"
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading
                    ? '💾 Saving...'
                    : isEditing
                      ? '✅ Update Expense'
                      : '💾 Save Expense'}
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