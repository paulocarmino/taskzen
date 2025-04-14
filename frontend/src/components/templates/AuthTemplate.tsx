export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
      <div className="w-full max-w-md bg-background p-6 rounded-lg shadow-md">{children}</div>
    </div>
  );
}
