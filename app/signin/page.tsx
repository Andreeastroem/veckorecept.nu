"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { HeaderLayout, MainLayout } from "../components/PageLayout";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  return (
    <div>
      <HeaderLayout />
      <MainLayout>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            void signIn("password", formData);
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
          <input name="flow" type="hidden" value={step} />
          <button
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg shadow-ring/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ring/40"
            type="submit"
          >
            {step === "signIn" ? "Sign in" : "Sign up"}
          </button>
          <div className="flex flex-row gap-2 justify-center text-sm">
            <span className="text-muted-foreground">
              {step === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <span
              className="text-destructive hover:text-destructive/80 underline hover:no-underline cursor-pointer transition-colors duration-300"
              onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
            >
              {step === "signIn" ? "Sign up instead" : "Sign in instead"}
            </span>
          </div>
        </form>
      </MainLayout>
    </div>
  );
}
