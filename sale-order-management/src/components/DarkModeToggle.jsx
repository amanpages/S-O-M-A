import React from 'react';

const DarkModeToggle = ({ theme, setTheme }) => {
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 bg-gray-700 text-white rounded"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;
