'use client';

import { useQuery } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  priceTaxIncluded: number;
  priceTaxExcluded: number;
  quantity: number;
  category?: string;
  images?: { url: string; cover: boolean }[];
}

interface ProductsResponse {
  items: Product[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

interface UseProductsParams {
  category?: number;
  limit?: number;
  page?: number;
  search?: string;
}

export const useProducts = (params?: UseProductsParams) => {
  const queryParams = new URLSearchParams();

  if (params?.category) queryParams.set('category', params.category.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.search) queryParams.set('search', params.search);

  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ''}`;

  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch products');
      }

      const data = await response.json();
      // L'API peut retourner { items: [...] } ou directement un tableau
      const rawItems = data.items || data || [];

      // Mapper les champs de l'API PrestaShop vers notre interface
      const items: Product[] = rawItems.map((item: Record<string, unknown>) => ({
        id: (item.productId || item.id || item.id_product) as number,
        name: (item.name || item.product_name || 'Sans nom') as string,
        description: item.description as string | undefined,
        price: (item.price || 0) as number,
        priceTaxIncluded: (item.priceTaxIncluded || item.price_tax_incl || item.price || 0) as number,
        priceTaxExcluded: (item.priceTaxExcluded || item.price_tax_excl || item.price || 0) as number,
        quantity: (item.quantity || item.stock || 0) as number,
        category: item.category as string | undefined,
        images: item.images as { url: string; cover: boolean }[] | undefined,
      }));

      return items;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export type { Product, ProductsResponse, UseProductsParams };
