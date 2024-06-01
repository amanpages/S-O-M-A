const customers = [
    {
      id: 9,
      customer: 11908,
      customer_profile: {
        id: 11908,
        name: "Aman",
        color: [182, 73, 99],
        email: "test@test.com",
        pincode: "828201",
        location_name: "Danabad, Jharkhand, India",
        type: "C",
        profile_pic: null,
        gst: "",
        password: "test@12345"
      }
    }
  ];
  
  const products = [
    {
      id: 209,
      display_id: 8,
      owner: 1079,
      name: "MacBook Air",
      category: "Pc",
      characteristics: "New Product Characteristics",
      features: "",
      brand: "Apple",
      sku: [
        {
          id: 248,
          selling_price: 89000,
          max_retail_price: 90000,
          amount: 33,
          unit: "unit",
          quantity_in_inventory: 8,
          product: 209
        },
      ],
      updated_on: "2024-05-24T12:46:41.995873Z",
      adding_date: "2024-05-24T12:46:41.995828Z"
    },
    {
      id: 210,
      display_id: 9,
      owner: 1080,
      name: "I Phone",
      category: "Mobile",
      characteristics: "Characteristics B",
      features: "Features B",
      brand: "Apple",
      sku: [
        {
          id: 249,
          selling_price: 60000,
          max_retail_price: 65000,
          amount: 40,
          unit: "unit",
          quantity_in_inventory: 15,
          product: 210
        },
      ],
      updated_on: "2024-06-01T12:00:00.000Z",
      adding_date: "2024-06-01T12:00:00.000Z"
    },
    {
      id: 211,
      display_id: 10,
      owner: 1081,
      name: "I Pad",
      category: "Tablet",
      characteristics: "Characteristics C",
      features: "Features C",
      brand: "Apple",
      sku: [
        {
          id: 251,
          selling_price: 70000,
          max_retail_price: 74000,
          amount: 50,
          unit: "kg",
          quantity_in_inventory: 18,
          product: 211
        }
      ],
      updated_on: "2024-06-01T12:00:00.000Z",
      adding_date: "2024-06-01T12:00:00.000Z"
    }
  ];
  
  const loadSaleOrders = () => {
    const storedOrders = localStorage.getItem('saleOrders');
    return storedOrders ? JSON.parse(storedOrders) : [];
  };
  
  let saleOrders = loadSaleOrders();
  
  export const mockLoginApi = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@test.com" && password === "test@12345") {
          resolve({ data: customers[0] });
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };
  
  export const fetchSaleOrders = async (status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(saleOrders.filter(order => order.status === status));
      }, 1000);
    });
  };
  
  export const createSaleOrder = async (saleOrder) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saleOrders.push({ ...saleOrder, id: saleOrders.length + 1, status: "active" });
        localStorage.setItem('saleOrders', JSON.stringify(saleOrders));
        resolve(saleOrder);
      }, 1000);
    });
  };
  
  export const updateSaleOrder = async (id, saleOrder) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = saleOrders.findIndex(order => order.id === id);
        if (index !== -1) {
          saleOrders[index] = { ...saleOrders[index], ...saleOrder };
          localStorage.setItem('saleOrders', JSON.stringify(saleOrders));
          resolve(saleOrders[index]);
        } else {
          reject(new Error("Sale order not found"));
        }
      }, 1000);
    });
  };
  
  export const fetchProducts = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products);
      }, 1000);
    });
  };