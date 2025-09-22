import { NextRequest, NextResponse } from 'next/server';
import { demoDataService } from '@/lib/demo-data/demo-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let period;
    if (from && to) {
      period = {
        from: new Date(from),
        to: new Date(to)
      };
    }

    const stats = demoDataService.getSalesStats(period);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales stats' },
      { status: 500 }
    );
  }
}
