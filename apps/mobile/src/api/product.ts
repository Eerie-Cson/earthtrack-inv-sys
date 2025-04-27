import { ProductQueryParams } from '../types';
import { apiProductClient } from './axiosConfig';

export const getProducts = async (params: ProductQueryParams) => {
  return apiProductClient.get('/products', { params });
};

export const getProductById = async (id: string) => {
  return apiProductClient.get(`/products/${id}`);
};

export const getProductCategories = async () => {
  return [
    { id: 'TOOLBOX', name: 'ToolBox', icon: 'toolbox' },
    { id: 'BEVERAGES', name: 'Beverages', icon: 'beverages' },
    { id: 'ACCESSORIES', name: 'Accessories', icon: 'accessories' },
  ];
};
