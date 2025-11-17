import { NextResponse } from 'next/server';
import { categoriesAPI } from '@/lib/prestashop';

export async function GET() {
  try {
    const categories = await categoriesAPI.getAll();

    // Cache pendant 10 minutes (catégories changent rarement)
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to fetch categories', details: errorMessage },
      { status: 500 }
    );
  }
}
