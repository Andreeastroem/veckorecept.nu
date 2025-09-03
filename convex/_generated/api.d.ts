/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as addRecipeToDatabase from "../addRecipeToDatabase.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as recipe from "../recipe.js";
import type * as recipesNotYetCrawled from "../recipesNotYetCrawled.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  addRecipeToDatabase: typeof addRecipeToDatabase;
  auth: typeof auth;
  http: typeof http;
  recipe: typeof recipe;
  recipesNotYetCrawled: typeof recipesNotYetCrawled;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
