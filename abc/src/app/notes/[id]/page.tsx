'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

const priorityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-700', dot: '🔴' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700', dot: '🟡' },
  low: { label: 'Low', color: 'bg-green-100 text-green-700', dot: '🟢' },
};

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/notes');
    } catch {
      alert('Failed to delete note');
      setDeleting(false);
    }
  };

  const handleTogglePin = async () => {
    if (!note) return;
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setNote(updated);
    } catch {
      alert('Failed to update note');
    }
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

  const priority = priorityConfig[note.priority] || priorityConfig.medium;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/notes" className="text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {note.isPinned && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">📌 Pinned</span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${priority.color}`}>
                {priority.dot} {priority.label}
              </span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                {note.category}
              </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{note.title}</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{note.content}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-400">
            <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
          <Link
            href={`/notes/${note.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Edit Note
          </Link>
          <button
            onClick={handleTogglePin}
            className="border border-slate-200 bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            {note.isPinned ? '📌 Unpin' : '📌 Pin'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="border border-red-200 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
