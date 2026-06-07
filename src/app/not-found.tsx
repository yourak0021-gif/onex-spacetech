import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10 flex items-center justify-center">
          <span className="text-2xl font-bold text-gradient">X</span>
        </div>
        <h1 className="text-5xl font-bold text-gradient mb-3">404</h1>
        <p className="text-white/30 text-sm font-light mb-2">
          This region of space has not been charted yet.
        </p>
        <p className="text-white/20 text-xs mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-gradient inline-flex px-6 py-2.5 rounded-full text-sm font-medium tracking-wider text-white"
        >
          Return Home
        </Link>
        <div className="mt-12 text-[10px] text-white/10 tracking-[0.3em] uppercase">
          OneX SpaceTechnologies
        </div>
      </div>
    </div>
  );
}
