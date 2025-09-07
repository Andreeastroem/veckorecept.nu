import { cronJobs } from "convex/server";
import { internal } from "./_generated/api.js";

const crons = cronJobs();

crons.interval(
  "crawl recipes",
  {
    hours: 12,
  },
  internal.recipe.crawlRecipesAction,
);

export default crons;
