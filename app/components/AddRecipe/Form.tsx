"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  link: z.string().min(1, { message: "External link is required" }),
  slug: z.string().min(1, { message: "Link is required" }),
});

export default function AddRecipeForm({
  setAddRecipe,
}: {
  setAddRecipe: React.Dispatch<boolean>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      link: "",
      slug: "",
    },
  });

  const addRecipeToBeCrawledMutation = useMutation(
    api.recipe.addRecipeToBeCrawled,
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    addRecipeToBeCrawledMutation({
      name: values.name,
      link: values.link,
      slug: values.slug,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Recipe name" {...field} />
              </FormControl>
              <FormDescription>This is the name of the recipe.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External link</FormLabel>
              <FormControl>
                <Input placeholder="External link to recipe" {...field} />
              </FormControl>
              <FormDescription>
                This is the original link to the recipe.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="Recipe link" {...field} />
              </FormControl>
              <FormDescription>
                This is the internal link to the recipe
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-1.5">
          <Button type="submit">Submit</Button>
          <Button
            variant="ghost"
            onClick={() => setAddRecipe(false)}
            className=""
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
