import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";

export function HeaderLayout() {
  return (
    <header className="flex justify-between px-8 py-4 items-center md:max-w-[640px] mx-auto">
      <div>
        <Link href="/" className="hover:underline">
          <h1 className="text-2xl font-bold text-primary">Veckorecept.nu</h1>
        </Link>
        <p className="text-sm">En vecka i taget</p>
      </div>
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
