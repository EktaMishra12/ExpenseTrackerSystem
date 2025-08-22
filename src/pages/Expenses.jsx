import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import { Search, Filter, Plus } from 'lucide-react';
import ExpenseCard from '../components/ExpenseCard';

const Expenses = () => {
  const navigate = useNavigate();
  const { expenses = [], deleteExpense, categories = [] } = useExpense();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Filter and sort expenses safely
  const filteredExpenses = expenses
    .filter(exp => {
      if (
        !exp ||
        typeof exp.category !== 'string' ||
        isNaN(Number(exp.amount))
      ) return false;

      const matchesSearch = exp.category
        .toLowerCase()
        .includes((searchTerm || '').toLowerCase());

      const matchesCategory =
        selectedCategory === '' || exp.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return Number(b.amount) - Number(a.amount);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return isNaN(dateB) - isNaN(dateA) || dateB - dateA;
      }
    });

  const handleEdit = (expense) => {
    navigate(`/edit/${expense._id}`); // ✅ fixed (MongoDB uses _id)
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id); // ✅ now id will be _id
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  return (
    <div className="expenses-page">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold gradient-text">💳 All Expenses</h1>
          <p className="text-muted">
            Manage and view all your expenses in one beautiful place
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section card mb-6">
        <div className="card-body">
          <h3 className="card-title mb-4">🔍 Filter & Search</h3>
          <div className="filters-grid grid grid-3">
            <div className="form-group">
              <label className="form-label">
                <Search size={16} />
                Search Expenses
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Filter size={16} />
                Filter by Category
              </label>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">📊 Sort By</label>
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date (Newest)</option>
                <option value="amount">Amount (Highest)</option>
                <option value="title">Title (A-Z)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Grid */}
      {filteredExpenses.length > 0 ? (
        <div className="expenses-grid grid grid-3">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense._id}             // ✅ use _id as key
              expense={expense}
              onEdit={handleEdit}
              onDelete={() => handleDelete(expense._id)} // ✅ pass _id here
            />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <div className="card-body">
            <h3>🔍 No expenses found</h3>
            <p>
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first expense to get started!'}
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate('/add')}
            >
              <Plus size={18} />
              ✨ Add Your First Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
