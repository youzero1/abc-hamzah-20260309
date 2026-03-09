'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NoteCard from '@/components/NoteCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { Suspense } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

function NotesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const priority = searchParams.get('priority') || '';

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (priority) params.set('priority', priority);

      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data.notes);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, priority]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('search', value);
    else params.delete('search');
    router.push(`/notes?${params.toString()}`);
  };

  const handleCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('category', value);
    else params.delete('category');
    router.push(`/notes?${params.toString()}`);
  };

  const handlePriority = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('priority', value);
    else params.delete('priority');
    router.push(`/notes?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchNotes();
    } catch {
      alert('Failed to delete note');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">All Notes</h1>
          <p className="text-sm text-slate-500">{total} note{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/notes/create"
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <span>+</span> New Note
        </Link>
      </div>

      <div className="space-y-3">
        <SearchBar value={search} onChange={handleSearch} />
        <div className="flex flex-wrap gap-2">
          <CategoryFilter value={category} onChange={handleCategory} />
          <select
            value={priority}
            onChange={(e) => handlePriority(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          {(search || category || priority) && (
            <button
              onClick={() => router.push('/notes')}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Clear Filters ✕
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center border border-slate-100">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-500 mb-4">
            {search || category || priority
              ? 'No notes match your filters.'
              : 'No notes yet. Create your first one!'}
          </p>
          <Link
            href="/notes/create"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Create Note
          </Link>
        </div>
      )}

      {!loading && !error && notes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>}>
      <NotesContent />
    </Suspense>
  );
}
