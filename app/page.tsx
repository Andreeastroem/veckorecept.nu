import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe/AddRecipe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout, HeaderLayout } from "./components/PageLayout";

import { List, Heart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <Content />
      </MainLayout>
    </>
  );
}

function Content() {
  return (
    <div className="flex flex-col gap-6">
      <AddRecipe />
      <div className="flex gap-6">
        <MenuLink href={"/recipes"} text="All recipes" />
        <MenuLink href="/generate" text="Generate" />
      </div>
      {/* Placeholder content with glassmorphism */}
      <div className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-6 shadow-xl shadow-ring/20">
        <RecipeTabs />
      </div>
    </div>
  );
}

function MenuLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-6 shadow-xl shadow-ring/20 w-full text-center"
    >
      {text}
    </Link>
  );
}

function RecipeTabs() {
  return (
    <Tabs defaultValue="your-recipes">
      <TabsList className="bg-accent">
        <TabsTrigger
          className="active:bg-card overflow-ellipsis"
          value="your-recipes"
        >
          <List />
        </TabsTrigger>
        <TabsTrigger
          className="active:bg-card overflow-ellipsis group"
          value="favorite-recipes"
        >
          <Heart className="group-focus:fill-red-500" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="your-recipes">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">
          Your Recipes
        </h3>
        <RecipeList />
      </TabsContent>
      <TabsContent value="favorite-recipes">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">
          Favorite Recipes
        </h3>
      </TabsContent>
    </Tabs>
  );
}
