import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchSaleOrders, createSaleOrder, updateSaleOrder } from '../api/index';

export const useSaleOrders = (status) => {
  return useQuery(['saleOrders', status], () => fetchSaleOrders(status));
};

export const useCreateSaleOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(createSaleOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries('saleOrders');
    }
  });
};

export const useUpdateSaleOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, saleOrder }) => updateSaleOrder(id, saleOrder), {
    onSuccess: () => {
      queryClient.invalidateQueries('saleOrders');
    }
  });
};
