import { Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    const safeAmount = Number(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(isNaN(safeAmount) ? 0 : safeAmount);
  };

  console.log('Incoming expense:', expense);

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': '#EF4444',
      'Transportation': '#3B82F6',
      'Shopping': '#8B5CF6',
      'Entertainment': '#F59E0B',
      'Bills & Utilities': '#10B981',
      'Healthcare': '#EC4899',
      'Travel': '#06B6D4',
      'Education': '#6366F1',
      'Personal Care': '#84CC16',
      'Other': '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  return (
    <div className="expense-card card fade-in">
      <div className="card-body">
        <div className="expense-header">
          <div className="expense-amount">
            {formatCurrency(expense?.amount)}
          </div>
          <div className="expense-actions">
            <button
              className="action-btn edit-btn"
              onClick={() => onEdit(expense)}
              title="Edit expense"
            >
              <Edit size={16} />
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete(expense?.id)}
              title="Delete expense"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h3 className="expense-title">{expense?.title || 'Untitled Expense'}</h3>

        {expense?.description && (
          <p className="expense-description">{expense.description}</p>
        )}

        <div className="expense-meta">
          <div className="meta-item">
            <Tag size={14} />
            <span
              className="category-tag"
              style={{
                backgroundColor: `${getCategoryColor(expense?.category)}20`,
                color: getCategoryColor(expense?.category)
              }}
            >
              {expense?.category || 'Other'}
            </span>
          </div>

          <div className="meta-item">
            <Calendar size={14} />
            <span>
              {expense?.date
                ? format(new Date(expense.date), 'MMM dd, yyyy')
                : 'No date'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;