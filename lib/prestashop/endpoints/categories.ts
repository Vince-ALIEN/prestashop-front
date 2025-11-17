import { prestashopClient } from '../client';
import type { Category, CategoriesResponse } from '../types';

export const categoriesAPI = {
  /**
   * Liste toutes les catégories
   */
  async getAll(): Promise<CategoriesResponse> {
    return prestashopClient.get('/categories');
  },

  /**
   * Récupère une catégorie par ID
   */
  async getById(id: number): Promise<Category> {
    return prestashopClient.get(`/categories/${id}`);
  },

  /**
   * Récupère l'arborescence complète des catégories
   */
  async getTree(): Promise<Category[]> {
    const response = await this.getAll();
    return buildCategoryTree(response.items);
  },
};

/**
 * Construit l'arborescence des catégories à partir d'une liste plate
 */
function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<number, Category>();
  const rootCategories: Category[] = [];

  // Première passe : créer un map de toutes les catégories
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Deuxième passe : construire l'arbre
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      const parent = categoryMap.get(cat.parentId)!;
      parent.children = parent.children || [];
      parent.children.push(category);
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}
