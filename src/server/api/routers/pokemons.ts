import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { PokemonClient } from "pokenode-ts";

export const pokemonRouter = createTRPCRouter({
  getPokemonById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const pokeApiConnection = new PokemonClient()
      const pokemon = await pokeApiConnection.getPokemonById(input.id)
      return { name: pokemon.name, sprites: pokemon.sprites }
    }),
  castVote: publicProcedure
    .input(z.object({
      votedFor: z.number(),
      votedAgainst: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const voteInDb = await ctx.prisma.vote.create({
        data: {
          ...input
        }
      })
      return {success: true, vote: voteInDb}
    }),
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),
});
