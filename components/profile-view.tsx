import { AuthHeader } from "@/components/auth-header";

export function ProfileView() {
  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl bg-white p-3 text-sm text-gray-900">
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <AuthHeader title="Profile" />
        <div className="rounded-card border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-700">Protected profile area.</p>
        </div>
      </section>
    </main>
  );
}
