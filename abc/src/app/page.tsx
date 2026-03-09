import Link from 'next/link';
import { getDataSource } from '@/lib/database';
import { Note } from '@/entities/Note';
import { Category } from '@/entities/Category';
import NoteCard from '@/components/NoteCard';

async function getDashboardData() {
  try {
    const ds = await getDataSource();
    const noteRepo = ds.getRepository(Note);
    const categoryRepo = ds.getRepository(Category);

    const [totalNotes, pinnedNotes, recentNotes, categories] = await Promise.all([
      noteRepo.count(),
      noteRepo.count({ where: { isPinned: true } }),
      noteRepo.find({
        order: { createdAt: 'DESC' },
        take: 6,
      }),
      categoryRepo.find(),
    ]);

    // Notes per category
    const notesPerCategory: Record<string, number> = {};
    for (const cat of categories) {
      const count = await noteRepo.count({ where: { category: cat.name } });
      notesPerCategory[cat.name] = count;
    }

    return { totalNotes, pinnedNotes, recentNotes, categories, notesPerCategory };
  } catch (error) {
    console.error('Dashboard data error:', error);
    return { totalNotes: 0, pinnedNotes: 0, recentNotes: [], categories: [], notesPerCategory: {} };
  }
}

export default async function HomePage() {
  const { totalNotes, pinnedNotes, recentNotes, categories, notesPerCategory } = await getDashboardData();

  const priorityCounts = {
    high: recentNotes.filter((n) => n.priority === 'high').length,
    medium: recentNotes.filter((n) => n.priority === 'medium').length,
    low: recentNotes.filter((n) => n.priority === 'low').length,
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-10 text-white">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME || 'abc'} 📝
        </h1>
        <p className="text-blue-100 text-sm md:text-base mb-6">
          Your e-commerce-inspired notes organizer. Manage ideas, inventory, suppliers, and more.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/notes/create"
            className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm md:text-base"
          >
            + New Note
          </Link>
          <Link
            href="/notes"
            className="border border-white text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm md:text-base"
          >
            View All Notes
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-2xl font-bold text-slate-800">{totalNotes}</div>
          <div className="text-sm text-slate-500 mt-1">Total Notes</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-2xl font-bold text-amber-500">{pinnedNotes}</div>
          <div className="text-sm text-slate-500 mt-1">Pinned</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-2xl font-bold text-red-500">{priorityCounts.high}</div>
          <div className="text-sm text-slate-500 mt-1">High Priority</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-2xl font-bold text-indigo-500">{categories.length}</div>
          <div className="text-sm text-slate-500 mt-1">Categories</div>
        </div>
      </div>

      {/* Categories Overview */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/notes?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <div
                  className="w-3 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="min-w-0">
                  <div className="font-medium text-slate-700 text-sm truncate">{cat.name}</div>
                  <div className="text-xs text-slate-400">{notesPerCategory[cat.name] || 0} notes</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Notes</h2>
          <Link href="/notes" className="text-blue-600 text-sm hover:underline">
            View all →
          </Link>
        </div>
        {recentNotes.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-slate-100">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-slate-500 mb-4">No notes yet. Create your first note!</p>
            <Link
              href="/notes/create"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Create Note
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
