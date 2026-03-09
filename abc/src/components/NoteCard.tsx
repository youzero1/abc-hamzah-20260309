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

interface NoteCardProps {
  note: Note;
  onDelete?: (id: number) => void;
}

const priorityColors = {
  high: 'border-red-400 bg-red-50',
  medium: 'border-amber-400 bg-amber-50',
  low: 'border-green-400 bg-green-50',
};

const priorityDots = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
};

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const priorityColor = priorityColors[note.priority] || priorityColors.medium;
  const priorityDot = priorityDots[note.priority] || priorityDots.medium;

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityColor} border border-slate-100 overflow-hidden hover:shadow-md transition-shadow`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.isPinned && <span className="text-xs">📌</span>}
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {note.category}
            </span>
            <span className="text-xs">{priorityDot}</span>
          </div>
        </div>

        <Link href={`/notes/${note.id}`}>
          <h3 className="font-semibold text-slate-800 mb-1.5 hover:text-blue-600 transition-colors line-clamp-2">
            {note.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 line-clamp-3 mb-3">{note.content}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {new Date(note.updatedAt).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/notes/${note.id}/edit`}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              Edit
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(note.id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
