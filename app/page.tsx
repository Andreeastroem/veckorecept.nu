import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe/AddRecipe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout, HeaderLayout } from "./components/PageLayout";

import { List, Heart } from "lucide-react";

export default function Home() {
  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="lg:text-6xl text-3xl font-bold text-primary">
            Veckorecept.nu
          </h1>
          <p className="text-muted-foreground text-lg">En vecka i taget</p>
        </div>
        <Content />
      </MainLayout>
    </>
  );
}

function Content() {
  return (
    <div className="space-y-6">
      <AddRecipe />
      {/* Placeholder content with glassmorphism */}
      <div className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-6 shadow-xl shadow-ring/20">
        <RecipeTabs />
      </div>
    </div>
  );
}

function RecipeTabs() {
  return (
    <Tabs className="">
      <TabsList defaultValue="your-recipes" className="bg-accent">
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
