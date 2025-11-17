import { NextRequest, NextResponse } from 'next/server';
import { productsAPI } from '@/lib/prestashop';
import type { ProductsQueryParams } from '@/lib/prestashop';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: ProductsQueryParams = {
      category: searchParams.get('category')
        ? parseInt(searchParams.get('category')!, 10)
        : undefined,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!, 10)
        : 20,
      page: searchParams.get('page')
        ? parseInt(searchParams.get('page')!, 10)
        : 1,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
    };

    const products = await productsAPI.getAll(params);

    // Cache pendant 5 minutes côté serveur, 10 min en stale-while-revalidate
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to fetch products', details: errorMessage },
      { status: 500 }
    );
  }
}
