import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { CalculationHistory } from '@/entities/CalculationHistory';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(CalculationHistory);
    const records = await repo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return NextResponse.json({ data: records });
  } catch (error) {
    console.error('GET /api/history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined) {
      return NextResponse.json(
        { error: 'Missing expression or result' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(CalculationHistory);

    const record = repo.create({
      expression: String(expression),
      result: String(result),
    });

    await repo.save(record);
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error('POST /api/history error:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
