import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { PokemonClient } from "pokenode-ts";

export const pokemonRouter = createTRPCRouter({
  getPokemonById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const api = new PokemonClient()
      const pokemon = await api.getPokemonById(input.id)
      return { name: pokemon.name, sprites: pokemon.sprites }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
