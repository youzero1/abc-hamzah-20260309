export default function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'abc';
  return (
    <footer className="bg-white border-t border-slate-100 py-6 mt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span className="font-medium text-slate-600">{appName}</span>
            <span>— Notes App with e-commerce organization</span>
          </div>
          <div>{new Date().getFullYear()} All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
