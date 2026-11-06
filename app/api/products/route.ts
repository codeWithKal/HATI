import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/repositories';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('products');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const product = await saveProduct(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error saving product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
