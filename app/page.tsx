import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe/AddRecipe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout, HeaderLayout } from "./components/PageLayout";

export default function Home() {
  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-primary">Veckorecept.nu</h1>
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
        <TabsTrigger className="active:bg-card" value="your-recipes">
          Your recipes
        </TabsTrigger>
        <TabsTrigger className="active:bg-card" value="favorite-recipes">
          Favorite recipes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="your-recipes">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">
          Your Recipes
        </h3>
        <RecipeList />
      </TabsContent>
    </Tabs>
  );
}
