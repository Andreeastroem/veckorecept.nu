"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto h-screen justify-center items-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-destructive bg-clip-text text-transparent">
          Veckorecept.nu
        </h1>
      </div>

      <div className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-8 shadow-xl shadow-ring/20 w-full">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData)
              .catch((error) => {
                setError(error.message);
              })
              .then(() => {
                router.push("/");
              });
          }}
        >
          <input
            className="backdrop-blur-sm bg-accent/50 text-accent-foreground placeholder-muted-foreground/50 rounded-xl p-3 border border-border focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all duration-300"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="backdrop-blur-sm bg-accent/50 text-accent-foreground placeholder-muted-foreground/50 rounded-xl p-3 border border-border focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all duration-300"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg shadow-ring/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ring/40"
            type="submit"
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>
          <div className="flex flex-row gap-2 justify-center text-sm">
            <span className="text-muted-foreground">
              {flow === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <span
              className="text-destructive hover:text-destructive/80 underline hover:no-underline cursor-pointer transition-colors duration-300"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
            </span>
          </div>
          {error && (
            <div className="backdrop-blur-sm bg-destructive/20 border border-destructive/30 rounded-xl p-3">
              <p className="text-destructive-foreground font-mono text-xs">
                Error signing in: {error}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
