"use client";

import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();

  return (
    <button
      className="backdrop-blur-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-200 rounded-xl px-6 py-3 border border-purple-400/30 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 font-medium"
      onClick={() => router.push("/signin")}
    >
      Sign in
    </button>
  );
}
