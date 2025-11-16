'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getAccessToken } from './useAuth';

interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  priceTaxExcluded: number;
  priceTaxIncluded: number;
  category?: string;
}

export const useProducts = () => {
  return useQuery<CartItem[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const token = await getAccessToken();
      const response = await axios.post('/api/proxy', {
        url: 'admin-api/products',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.items || [];
    },
  });
};
