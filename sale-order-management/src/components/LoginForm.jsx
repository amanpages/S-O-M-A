import React from 'react';
import { useForm } from 'react-hook-form';

const LoginForm = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: true })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          {...register('password', { required: true })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
