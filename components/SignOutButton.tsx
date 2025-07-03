"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <button
          className="backdrop-blur-xl bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-xl px-4 py-2 border border-border shadow-lg shadow-ring/20 transition-all duration-300 hover:shadow-xl hover:shadow-ring/30 hover:scale-105 font-medium"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      )}
    </>
  );
}
