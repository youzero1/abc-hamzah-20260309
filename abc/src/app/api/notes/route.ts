import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Note } from '@/entities/Note';
import { Like } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const noteRepo = ds.getRepository(Note);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const priority = searchParams.get('priority') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any[] = [];

    if (search && category) {
      where.push({ title: Like(`%${search}%`), category });
      where.push({ content: Like(`%${search}%`), category });
    } else if (search) {
      where.push({ title: Like(`%${search}%`) });
      where.push({ content: Like(`%${search}%`) });
    } else if (category) {
      where.push({ category });
    }

    if (priority && where.length > 0) {
      where.forEach((w) => (w.priority = priority));
    } else if (priority) {
      where.push({ priority });
    }

    const [notes, total] = await noteRepo.findAndCount({
      where: where.length > 0 ? where : undefined,
      order: { isPinned: 'DESC', updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ notes, total, page, limit });
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const noteRepo = ds.getRepository(Note);

    const body = await request.json();
    const { title, content, category, priority, isPinned } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const note = noteRepo.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
      priority: priority || 'medium',
      isPinned: isPinned || false,
    });

    const saved = await noteRepo.save(note);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
