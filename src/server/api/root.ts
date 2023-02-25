import { createTRPCRouter } from "./trpc";
import { pokemonRouter } from "./routers/pokemons";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  pokemons: pokemonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
