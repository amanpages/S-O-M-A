import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useQueryClient } from 'react-query';

const Header = ({ theme, setTheme, isLoading }) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        setLoggingOut(true);
        localStorage.removeItem('user');
        // Simulate logout delay for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000)); // Changed to 1 second
        queryClient.clear(); // Clear cache
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setLoggingOut(false);
      }
    };

    if (loggingOut) {
      logoutUser();
    }
  }, [loggingOut, navigate, queryClient]);

  return (
    <header className="flex justify-between p-4 bg-gray-200 dark:bg-gray-700">
      <h1 className="text-xl text-gray-900 dark:text-white">Sale Order Management</h1>
      <div>
        <DarkModeToggle theme={theme} setTheme={setTheme} />
        {isLoading ? (
          <div className="flex justify-center items-center loading-overlay">
            <div className="loader loading-spinner"></div>
          </div>
        ) : (
          <button
            onClick={() => setLoggingOut(true)} 
            className="ml-4 p-2 bg-red-500 text-white rounded relative"
          >
            Logout
            {loggingOut && ( 
              <div className="absolute inset-0 flex justify-center items-center bg-opacity-75 bg-white rounded">
                <div className="loader inline-block"></div>
              </div>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
