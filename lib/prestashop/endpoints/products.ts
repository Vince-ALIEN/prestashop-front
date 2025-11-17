import { prestashopClient } from '../client';
import type { Product, ProductsResponse, ProductsQueryParams } from '../types';

export const productsAPI = {
  /**
   * Liste tous les produits
   */
  async getAll(params?: ProductsQueryParams): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.category) searchParams.set('category', params.category.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.order) searchParams.set('order', params.order);

    const query = searchParams.toString();
    return prestashopClient.get(`/products${query ? `?${query}` : ''}`);
  },

  /**
   * Récupère un produit par ID
   */
  async getById(id: number): Promise<Product> {
    return prestashopClient.get(`/products/${id}`);
  },

  /**
   * Récupère les produits d'une catégorie
   */
  async getByCategory(categoryId: number, params?: Omit<ProductsQueryParams, 'category'>): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());

    const query = searchParams.toString();
    return prestashopClient.get(`/categories/${categoryId}/products${query ? `?${query}` : ''}`);
  },

  /**
   * Recherche de produits
   */
  async search(query: string, params?: Omit<ProductsQueryParams, 'search'>): Promise<ProductsResponse> {
    return this.getAll({ ...params, search: query });
  },
};
