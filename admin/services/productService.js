import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKENDURL;

export const addProduct = async (formData) => {
  try {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    console.log('📤 Adding product...', backendUrl);
    
    const response = await axios.post(
      `${backendUrl}/api/product/add`,
      formData,
      {
        headers: {
          'token': token,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('✅ Product added:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Add Product Error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to add product' };
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/product/list`);
    return response.data;
  } catch (error) {
    console.error('❌ Get Products Error:', error);
    throw error.response?.data || { message: 'Failed to get products' };
  }
};

export const removeProduct = async (productId) => {
  try {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    const response = await axios.post(
      `${backendUrl}/api/product/remove`,
      { id: productId },
      {
        headers: {
          'token': token
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('❌ Remove Product Error:', error);
    throw error.response?.data || { message: 'Failed to remove product' };
  }
};