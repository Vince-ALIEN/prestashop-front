export interface Product {
  id: number;
  name: string;
  description?: string;
  descriptionShort?: string;
  price: number;
  priceTaxIncluded: number;
  priceTaxExcluded: number;
  quantity: number;
  active: boolean;
  reference?: string;
  ean13?: string;
  category?: string;
  categoryId?: number;
  manufacturerId?: number;
  manufacturerName?: string;
  images?: ProductImage[];
  combinations?: ProductCombination[];
  weight?: number;
  dateAdd?: string;
  dateUpd?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  cover: boolean;
  position: number;
}

export interface ProductCombination {
  id: number;
  reference: string;
  price: number;
  quantity: number;
  attributes: ProductAttribute[];
}

export interface ProductAttribute {
  id: number;
  name: string;
  value: string;
  groupName: string;
}

export interface ProductsResponse {
  items: Product[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface ProductsQueryParams {
  category?: number;
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}
