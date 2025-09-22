import { NextRequest, NextResponse } from 'next/server';
import { demoDataService, DemoSale } from '@/lib/demo-data/demo-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('store_id');
    const userId = searchParams.get('user_id');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let sales: DemoSale[];

    if (storeId) {
      sales = demoDataService.getSalesByStore(storeId);
    } else if (userId) {
      sales = demoDataService.getSalesByUser(userId);
    } else if (from && to) {
      sales = demoDataService.getSalesByDateRange(new Date(from), new Date(to));
    } else {
      sales = demoDataService.getAllSales();
    }

    return NextResponse.json({ sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['store_id', 'user_id', 'product_name', 'category', 'quantity', 'unit_price', 'sale_date', 'payment_method'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Calculate total amount
    const total_amount = body.quantity * body.unit_price;

    const newSale = demoDataService.addSale({
      store_id: body.store_id,
      user_id: body.user_id,
      product_name: body.product_name,
      category: body.category,
      quantity: body.quantity,
      unit_price: body.unit_price,
      total_amount,
      sale_date: body.sale_date,
      payment_method: body.payment_method
    });

    return NextResponse.json({ sale: newSale }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
