import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Note } from '@/entities/Note';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const noteRepo = ds.getRepository(Note);
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const note = await noteRepo.findOne({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('GET /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const noteRepo = ds.getRepository(Note);
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const note = await noteRepo.findOne({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, category, priority, isPinned } = body;

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    if (category !== undefined) note.category = category;
    if (priority !== undefined) note.priority = priority;
    if (isPinned !== undefined) note.isPinned = isPinned;

    const updated = await noteRepo.save(note);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const noteRepo = ds.getRepository(Note);
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const note = await noteRepo.findOne({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await noteRepo.remove(note);
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
