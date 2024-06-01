import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchProducts } from '../api/index';

const SaleOrderForm = ({ onSubmit, defaultValues, readOnly }) => {
  const { handleSubmit, control, register, setValue, watch, setError, formState: { errors } } = useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const [products, setProducts] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      const productData = await fetchProducts();
      setProducts(productData);
    };

    loadProducts();
  }, []);

  const generateInvoiceNo = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${year}${month}${day}${hours}${minutes}${seconds}${randomNum}`;
    
    // Store invoice number in localStorage
    localStorage.setItem('invoiceNumber', invoiceNumber);

    return invoiceNumber;
  };

  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find(product => product.id === parseInt(productId));
    if (selectedProduct) {
      const sku = selectedProduct.sku[0]; // assuming you want the first SKU
      setValue(`items[${index}].product_name`, selectedProduct.name); // Store product name in the form data
      setValue(`items[${index}].price`, sku.selling_price);
      setValue(`items[${index}].quantity_in_inventory`, sku.quantity_in_inventory);
    }
  };

  const selectedDate = watch('invoice_date');

  const handleDateChange = (date) => {
    const currentDate = new Date();
    if (date > currentDate) {
      setError('invoice_date', {
        type: 'manual',
        message: 'Future dates are not allowed.'
      });
    } else {
      setValue('invoice_date', date);
      setError('invoice_date', null);
    }
  };

  const handleFormSubmit = async (formData) => {
    const hasErrors = Object.keys(errors).length > 0;
    const hasProducts = fields.length > 0;

    if (!hasProducts) {
      alert('Please select at least one product.');
      return;
    }

    if (hasErrors) {
      alert('Please fix the form errors before submitting.');
      return;
    }

    setInvoiceNo(generateInvoiceNo());
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <label htmlFor="customer_name" className="font-bold">Customer Name</label>
      <Controller
        name="customer_name"
        control={control}
        rules={{ required: 'Customer name is required' }}
        render={({ field }) => (
          <>
            <input
              {...field}
              id="customer_name"
              placeholder="Customer Name"
              readOnly={readOnly}
              className="p-2 border border-gray-300 rounded"
            />
            {errors.customer_name && <span className="text-red-500">{errors.customer_name.message}</span>}
          </>
        )}
      />
      {fields.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <Controller
            name={`items[${index}].product_id`}
            control={control}
            rules={{ required: 'Product is required' }}
            render={({ field }) => (
              <>
                <select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleProductChange(index, e.target.value);
                  }}
                  className="p-2 border border-gray-300 rounded"
                  disabled={readOnly}
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors.items?.[index]?.product_id && <span className="text-red-500">{errors.items[index].product_id.message}</span>}
              </>
            )}
          />
          <Controller
            name={`items[${index}].product_name`}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="hidden"
              />
            )}
          />
          <input
            type="text"
            value={watch(`items[${index}].price`)}
            readOnly
            placeholder="Sale Price"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={watch(`items[${index}].quantity_in_inventory`)}
            readOnly
            placeholder="Total Stock"
            className="p-2 border border-gray-300 rounded"
          />
          <Controller
            name={`items[${index}].quantity`}
            control={control}
            rules={{ 
              required: 'Quantity is required',
              validate: (value) => {
                return value <= parseInt(watch(`items[${index}].quantity_in_inventory`)) || 'Quantity exceeds stock.';
              }
            }}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  placeholder="Quantity"
                  readOnly={readOnly}
                  className="p-2 border border-gray-300 rounded"
                />
                {errors.items?.[index]?.quantity && <span className="text-red-500">{errors.items[index].quantity.message}</span>}
              </>
            )}
          />
          {!readOnly && (
            <button type="button" onClick={() => remove(index)} className="p-2 bg-red-500 text-white rounded">
              Remove
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <button type="button" onClick={() => append({ product_id: '', price: '', quantity: '' })} className="p-2 bg-blue-500 text-white rounded">
          Add Product
        </button>
      )}
      <label htmlFor="invoice_date" className="font-bold">Invoice Date</label>
      <DatePicker
        {...register('invoice_date', { 
          required: 'Invoice date is required',
          validate: value => new Date(value) <= new Date() || 'Future dates are not allowed.'
        })}
        selected={selectedDate}
        onChange={(date) => handleDateChange(date)}
        placeholderText="Select Invoice Date"
        dateFormat="dd/MM/yyyy"
        className={`p-2 border border-gray-300 rounded ${errors.invoice_date ? 'border-red-500' :          ''}`}
        readOnly={readOnly}
      />
      {errors.invoice_date && <span className="text-red-500">{errors.invoice_date.message}</span>}
      <button type="submit" className="p-2 mt-8 bg-green-500 text-white rounded">
        {readOnly ? 'View' : 'Submit'}
      </button>
    </form>
  );
};

export default SaleOrderForm;

