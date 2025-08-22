import { Link, useLocation } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      emoji: '📊',
      label: 'Dashboard'
    },
    {
      path: '/expenses',
      emoji: '🧾',
      label: 'Expenses',
    },
    {
      path: '/add',
      emoji: '➕',
      label: 'Add Expense'
    }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <TrendingUp className="nav-logo" />
          <span className="nav-title">Expensify</span>
        </div>

        <ul className="nav-menu">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: item.emojiSize || '2 rem' }}>
                      {item.emoji}
                    </span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;