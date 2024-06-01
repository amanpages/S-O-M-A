import { useMutation } from 'react-query';
import { mockLoginApi } from '../api';

export const useLogin = () => {
  return useMutation(({ email, password }) => mockLoginApi(email, password));
};
