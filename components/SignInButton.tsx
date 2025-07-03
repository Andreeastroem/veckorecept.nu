"use client";

import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();

  return (
    <button
      className="backdrop-blur-xl bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 text-primary-foreground rounded-xl px-6 py-3 border border-border shadow-lg shadow-ring/20 transition-all duration-300 hover:shadow-xl hover:shadow-ring/30 hover:scale-105 font-medium"
      onClick={() => router.push("/signin")}
    >
      Sign in
    </button>
  );
}
