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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          Matveckolistan
        </h1>
        <p className="text-purple-200/80 text-lg">Log in to see the numbers</p>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-purple-400/20 rounded-2xl p-8 shadow-xl shadow-purple-500/20 w-full">
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
            className="backdrop-blur-sm bg-purple-500/10 text-purple-100 placeholder-purple-300/50 rounded-xl p-3 border border-purple-400/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="backdrop-blur-sm bg-purple-500/10 text-purple-100 placeholder-purple-300/50 rounded-xl p-3 border border-purple-400/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40"
            type="submit"
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>
          <div className="flex flex-row gap-2 justify-center text-sm">
            <span className="text-purple-200/80">
              {flow === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <span
              className="text-orange-400 hover:text-orange-300 underline hover:no-underline cursor-pointer transition-colors duration-300"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
            </span>
          </div>
          {error && (
            <div className="backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-xl p-3">
              <p className="text-red-200 font-mono text-xs">
                Error signing in: {error}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
