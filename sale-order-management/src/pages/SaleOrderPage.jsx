import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import Modal from 'react-modal';
import { useSaleOrders, useCreateSaleOrder, useUpdateSaleOrder } from '../hooks/useSaleOrders';
import SaleOrderForm from '../components/SaleOrderForm';
import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import useDarkMode from '../hooks/useDarkMode';
import Header from '../components/Header';

Modal.setAppElement('#root');

const SaleOrderPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [status, setStatus] = useState('active');
  const [theme, setTheme] = useDarkMode();
  const queryClient = useQueryClient();
  const { data: saleOrders, refetch } = useSaleOrders(status);
  const createSaleOrder = useCreateSaleOrder();
  const updateSaleOrder = useUpdateSaleOrder();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSaleOrder = async (saleOrder) => {
    setIsLoading(true); 
    await createSaleOrder.mutateAsync(saleOrder);
    setIsModalOpen(false);
    refetch();
    setIsLoading(false); 
  };

  const handleEditSaleOrder = async (id, saleOrder) => {
    setIsLoading(true); 
    await updateSaleOrder.mutateAsync({ id, saleOrder });
    setIsModalOpen(false);
    refetch();
    setIsLoading(false); 
  };

  const handleMarkAsPaid = async (id) => {
    setIsLoading(true); 
    const orderToUpdate = saleOrders.find(order => order.id === id);
    if (orderToUpdate) {
      await updateSaleOrder.mutateAsync({ id, saleOrder: { ...orderToUpdate, status: 'completed' } });
      setIsModalOpen(false);
      refetch();
    }
    setIsLoading(false);
  };

  const handleOpenModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleViewOrder = (order) => {
    setModalContent({ type: 'view', order });
    setIsModalOpen(true);
  };

  return (
    <div className={`p-2 ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Header theme={theme} setTheme={setTheme} />
      <div className="flex justify-between mb-4 mt-3">
        <div>
          <button
            onClick={() => setStatus('active')}
            className={`p-2 ${status === 'active' ? 'bg-gray-300' : ''}`}
          >
            Active Sale Orders
          </button>
          <button
            onClick={() => setStatus('completed')}
            className={`p-2 ${status === 'completed' ? 'bg-gray-300' : ''}`}
          >
            Completed Sale Orders
          </button>
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          className="p-2 bg-blue-500 text-white rounded"
        >
          + Sale Order
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full table-auto border-collapse ${theme === 'dark' ? 'dark' : ''}`}>
          <thead className={`${theme === 'dark' ? 'dark' : ''}`}>
            <tr>
              <th className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>ID</th>
              <th className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>Customer Name</th>
              <th className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>Price (₹)</th>
              <th className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>Last Modified</th>
              <th className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {saleOrders?.map(order => (
              <tr key={order.id} className={`${theme === 'dark' ? 'dark' : ''} border border-gray-300`}>
                <td className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>{order.id}</td>
                <td className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>{order.customer_name}</td>
                <td className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>{order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</td>
                <td className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>{new Date(order.invoice_date).toLocaleDateString()}</td>
                <td className={`border ${theme === 'dark' ? 'dark' : ''} border-gray-300 px-4 py-2`}>
                  <Menu
                    menuButton={<button className="p-2 bg-gray-400 rounded">...</button>}
                  >
                    {status === 'active' && (
                      <MenuItem onClick={() => handleOpenModal({ type: 'edit', order })}>
                        Edit
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleViewOrder(order)}>
                      View
                    </MenuItem>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {modalContent === 'create' ? 'Create Sale Order' : modalContent?.type === 'edit' ? 'Edit Sale Order' : 'Order Details'}
          </h2>
          <button onClick={handleCloseModal} className="text-red-500 text-3xl px-10">
            &times;
          </button>
          </div>
        {isLoading && (
          <div className="flex justify-center items-center loading-overlay">
            <div className="loader loading-spinner"></div>
          </div>
        )}
        {modalContent === 'create' && (
          <SaleOrderForm onSubmit={handleCreateSaleOrder} defaultValues={{}} readOnly={false} />
        )}
        {modalContent?.type === 'edit' && (
          <div>
            <h2 className="mb-2 mt-5"><strong className='text-xl'>Invoice Number:</strong> {localStorage.getItem('invoiceNumber')}</h2>
            <SaleOrderForm
              onSubmit={(data) => handleEditSaleOrder(modalContent.order.id, data)}
              defaultValues={modalContent.order}
              readOnly={status === 'completed'}
            />
            {modalContent.order.status === 'active' && (
              <button
                onClick={() => handleMarkAsPaid(modalContent.order.id)}
                className="mt-4 p-2 w-full bg-blue-700 text-white rounded"
              >
                Mark as Paid
              </button>
            )}
          </div>
        )}
        {modalContent?.type === 'view' && (
          <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <p className="mb-2"><strong className='text-xl'>Customer Name:</strong> {modalContent.order.customer_name}</p>
            <p className="mb-2"><strong className='text-xl'>Products Ordered:</strong></p>
            <ul className="list-disc ml-5 mb-2">
              {modalContent.order.items.map(item => (
                <li key={item.id}>
                  <p><strong>Product:</strong> {item.product_name}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                  <p><strong>Total:</strong> ₹{item.price * item.quantity}</p>
                </li>
              ))}
            </ul>
            <p className="mb-2"><strong className='text-xl'>Date of Order:</strong> {new Date(modalContent.order.invoice_date).toLocaleDateString()}</p>
            <p className="mb-2"><strong className='text-xl'>Invoice Number:</strong> {localStorage.getItem('invoiceNumber')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SaleOrderPage;

