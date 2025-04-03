import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);
// Fetch all products
export const fetchProducts = async () => {
  console.log(`${API_URL}/products`);
  const { data } = await axios.get(`${API_URL}/products`);
  return data;
};

// Create a product
export const createProduct = async (product) => {
  const { data } = await axios.post(`${API_URL}/products`, product);
  return data;
};

// Update a product
export const updateProduct = async (id, product) => {
  const { data } = await axios.put(`${API_URL}/products/${id}`, product);
  return data;
};

// Delete a product
export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/products/${id}`);
};
