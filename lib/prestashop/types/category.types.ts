export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  active: boolean;
  position: number;
  levelDepth: number;
  children?: Category[];
  image?: string;
  productCount?: number;
}

export interface CategoriesResponse {
  items: Category[];
  totalCount?: number;
}
