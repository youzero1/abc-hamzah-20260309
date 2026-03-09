'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm';
import Link from 'next/link';

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isPinned: boolean;
}

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${params.id}`);
        if (!res.ok) throw new Error('Note not found');
        const data = await res.json();
        setNote(data);
      } catch {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [params.id]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category: string;
    priority: string;
    isPinned: boolean;
  }) => {
    const res = await fetch(`/api/notes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update note');
    }

    router.push(`/notes/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-700 mb-4">{error || 'Note not found'}</p>
          <Link href="/notes" className="text-blue-600 hover:underline">
            ← Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/notes/${params.id}`} className="text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Edit Note</h1>
      </div>
      <NoteForm
        initialData={note}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
