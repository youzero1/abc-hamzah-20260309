import NoteCard from './NoteCard';

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

interface NoteListProps {
  notes: Note[];
  onDelete?: (id: number) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-4xl mb-3">📝</div>
        <p>No notes found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
}
