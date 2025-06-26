"use client";

import AddRecipe from "@/components/addRecipe";
import SignOutButton from "@/components/SignOutButton";
import { useState } from "react";

export default function Home() {
  return (
    <>
      <header className="max-w-[640px] mx-auto sticky top-0 z-10 backdrop-blur-xl bg-black/20 border-b border-purple-500/30 p-4 flex flex-row justify-between items-center rounded-b-2xl shadow-2xl shadow-purple-500/20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          Matveckolistan
        </h1>
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-8 max-w-[640px] mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
            Matveckolistan
          </h1>
          <p className="text-purple-200/80 text-lg">
            Plan your weekly meals with style
          </p>
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
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/30 backdrop-blur-sm border border-purple-400/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40"
        >
          Add recipe
        </button>
      )}

      {/* Placeholder content with glassmorphism */}
      <div className="backdrop-blur-xl bg-white/5 border border-purple-400/20 rounded-2xl p-6 shadow-xl shadow-purple-500/10">
        <h3 className="text-xl font-semibold text-purple-200 mb-4">
          Your Recipes
        </h3>
        <div className="space-y-3">
          <div className="backdrop-blur-sm bg-purple-500/10 border border-purple-400/20 rounded-xl p-4 hover:bg-purple-500/20 transition-colors duration-300">
            <p className="text-purple-100">
              No recipes yet. Add your first recipe to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
