import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";

export function HeaderLayout() {
  return (
    <header className="mx-4 max-w-[640px] md:mx-auto sticky top-0 z-10 backdrop-blur-xl bg-background/20 border-b border-border p-4 flex flex-row justify-between items-center rounded-b-2xl shadow-2xl shadow-ring/20">
      <Link href="/" className="hover:underline">
        <h1 className="text-2xl font-bold text-primary">Veckorecept.nu</h1>
      </Link>
      <SignOutButton />
    </header>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-8 flex flex-col gap-8 max-w-[640px] mx-auto">
      {children}
    </main>
  );
}
