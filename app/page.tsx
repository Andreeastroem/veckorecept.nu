"use client";

import AddRecipe from "@/components/addRecipe";
import SignOutButton from "@/components/SignOutButton";
import { useState } from "react";

export default function Home() {
  return (
    <>
      <header className="max-w-[640px] mx-auto sticky top-0 z-10 backdrop-blur-xl bg-background/20 border-b border-border p-4 flex flex-row justify-between items-center rounded-b-2xl shadow-2xl shadow-ring/20">
        <h1 className="text-2xl font-bold text-primary">Matlistan</h1>
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-8 max-w-[640px] mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-primary">Matlistan</h1>
          <p className="text-muted-foreground text-lg">En vecka i taget</p>
        </div>
        <Content />
      </main>
    </>
  );
}

function Content() {
  const [addRecipe, setAddRecipe] = useState(false);

  return (
    <div className="space-y-6">
      {addRecipe ? (
        <AddRecipe />
      ) : (
        <button
          onClick={() => setAddRecipe(() => true)}
          className="w-full font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-ring/30 backdrop-blur-sm border border-border transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ring/40"
        >
          Add recipe
        </button>
      )}

      {/* Placeholder content with glassmorphism */}
      <div className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-6 shadow-xl shadow-ring/20">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">
          Your Recipes
        </h3>
        <div className="space-y-3">
          <div className="backdrop-blur-sm bg-accent border border-border rounded-xl p-4 hover:bg-accent/90 transition-colors duration-300">
            <p className="text-accent-foreground">
              No recipes yet. Add your first recipe to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
