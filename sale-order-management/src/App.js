import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginPage from './pages/LoginPage';
import SaleOrderPage from './pages/SaleOrderPage';
import useDarkMode from './hooks/useDarkMode';

const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = useDarkMode();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={theme === 'dark' ? 'dark' : ''}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/order" element={<SaleOrderPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
