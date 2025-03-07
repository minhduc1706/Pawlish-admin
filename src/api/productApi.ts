import apiClient from "@/config/axiosClient";
import { Product } from "@/interfaces/Product";

export const getProducts = async () => {
  const { data } = await apiClient.get("/product");
  return data;
};

export const getProductById = async (id: string) => {
  const { data } = await apiClient.get(`/product/${id}`);
  return data;
};

export const addProduct = async (product: Product) => {
  const { data } = await apiClient.post("/product", product);
  return data;
};

export const updateProduct = async (id: string, product: Product) => {
  const { data } = await apiClient.put(`/product/${id}`, product);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await apiClient.delete(`/product/${id}`);
  return data;
};
