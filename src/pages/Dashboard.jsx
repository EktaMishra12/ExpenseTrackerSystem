import { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { expenses } = useExpense();
  const [timeFilter, setTimeFilter] = useState('all');

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (timeFilter) {
        case 'month':
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        case 'year':
          return expenseDate.getFullYear() === currentYear;
        default:
          return true;
      }
    });

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    const avgAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;

    return {
      total: totalAmount,
      count: filteredExpenses.length,
      average: avgAmount,
      expenses: filteredExpenses
    };
  }, [expenses, timeFilter]);

  const categoryData = useMemo(() => {
    const categoryTotals = {};
    stats.expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount || 0);
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / stats.total) * 100).toFixed(1)
    }));
  }, [stats]);

  const monthlyData = useMemo(() => {
    const monthlyTotals = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + parseFloat(expense.amount || 0);
    });

    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount
      }));
  }, [expenses]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#6366F1', '#84CC16', '#6B7280'];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">💰 Expense Dashboard</h1>
          <p className="text-muted">Track your expenses and spending patterns with beautiful insights</p>
        </div>

        <div className="time-filter">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="form-control"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid grid-4 gap-4 mb-6">
        <StatCard title="💸 Total Expenses" value={stats.total} icon={DollarSign} color="primary" />
        <StatCard title="📊 Transactions" value={stats.count} icon={TrendingUp} color="secondary" />
        <StatCard title="📈 Average Expense" value={stats.average.toFixed(2)} icon={TrendingDown} color="accent" />
        <StatCard title="🏷️ Categories" value={categoryData.length} icon={Calendar} color="warning" />
      </div>

      {/* Charts */}
      <div className="charts-grid grid grid-2 gap-4 mb-6">
        {/* Category PieChart */}
        <div className="chart-card card">
          <div className="card-header">
            <h3 className="card-title">🎯 Expenses by Category</h3>
          </div>
          <div className="card-body">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No expenses to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly BarChart */}
        <div className="chart-card card">
          <div className="card-header">
            <h3 className="card-title">📈 Monthly Spending Trend</h3>
          </div>
          <div className="card-body">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No data to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="recent-expenses card">
        <div className="card-header">
          <h3 className="card-title">⏰ Recent Expenses</h3>
        </div>
        <div className="card-body">
          {stats.expenses.length > 0 ? (
            <div className="expense-list">
              {stats.expenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id || expense.title + expense.date}
                  className="expense-item flex justify-between items-center mb-2"
                >
                  <div className="expense-info">
                    <h4 className="expense-name font-semibold">{expense.title}</h4>
                    <p className="expense-category text-muted">{expense.category || 'Other'}</p>
                  </div>
                  <div className="expense-details text-right">
                    <div className="expense-amount font-semibold">
                      ${parseFloat(expense.amount || 0).toFixed(2)}
                    </div>
                    <div className="expense-date text-muted text-sm">
                      {expense.date ? new Date(expense.date).toLocaleDateString() : '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-4">
              <h3>No expenses found</h3>
              <p>Start adding expenses to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
