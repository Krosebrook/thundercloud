import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-6xl font-bold">Thundercloud</h1>
        <p className="text-2xl text-muted-foreground">
          AI Website Builder - Generate Production-Quality Sites in Minutes
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-input px-8 py-3 text-lg font-semibold hover:bg-accent"
          >
            Log In
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">⚡ Fast</h3>
            <p className="mt-2 text-muted-foreground">
              Generate in 30-60 seconds
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">✨ Quality</h3>
            <p className="mt-2 text-muted-foreground">
              Studio-grade websites
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">🚀 Deploy</h3>
            <p className="mt-2 text-muted-foreground">
              One-click publishing
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
