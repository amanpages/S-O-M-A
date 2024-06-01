import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate, isLoading, error } = useLogin();

  const handleLogin = ({ email, password }) => {
    mutate({ email, password }, {
      onSuccess: () => {
        navigate('/order');
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-400">
      <div className="p-6 rounded-lg shadow-lg w-96 glassmorphic">
        <h1 className="text-2xl mb-4 text-center text-gray-900">Login</h1>
        <LoginForm onSubmit={handleLogin} />
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="loader"></div>
          </div>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error.message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
