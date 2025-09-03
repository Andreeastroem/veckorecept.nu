"use client";

import { useState } from "react";
import AddRecipeForm from "./Form";

export default function AddRecipe() {
  const [addRecipe, setAddRecipe] = useState(false);

  if (!addRecipe) {
    return (
      <button
        onClick={() => setAddRecipe(() => true)}
        className="w-full font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-ring/30 backdrop-blur-sm border border-border transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ring/40"
      >
        Add recipe
      </button>
    );
  }

  return <AddRecipeForm setAddRecipe={setAddRecipe} />;
}
