'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm';
import Link from 'next/link';

export default function CreateNotePage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category: string;
    priority: string;
    isPinned: boolean;
  }) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create note');
    }

    const note = await res.json();
    router.push(`/notes/${note.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/notes" className="text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Create New Note</h1>
      </div>
      <NoteForm onSubmit={handleSubmit} submitLabel="Create Note" />
    </div>
  );
}
