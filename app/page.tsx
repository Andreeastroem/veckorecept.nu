import SignOutButton from "@/components/SignOutButton";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe/AddRecipe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <>
      <header className="max-w-[640px] mx-auto sticky top-0 z-10 backdrop-blur-xl bg-background/20 border-b border-border p-4 flex flex-row justify-between items-center rounded-b-2xl shadow-2xl shadow-ring/20">
        <h1 className="text-2xl font-bold text-primary">Veckorecept.nu</h1>
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-8 max-w-[640px] mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-primary">Veckorecept.nu</h1>
          <p className="text-muted-foreground text-lg">En vecka i taget</p>
        </div>
        <Content />
      </main>
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
