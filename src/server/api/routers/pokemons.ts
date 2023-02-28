import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// import { PokemonClient } from "pokenode-ts";

export const pokemonRouter = createTRPCRouter({
  getPokemonById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      // const pokeApiConnection = new PokemonClient()
      // const pokemon = await pokeApiConnection.getPokemonById(input.id)
      const pokemon = await ctx.prisma.pokemon.findFirst({ where: {id: input.id}})
      
      if(!pokemon) throw new Error("lol poekmon doesn't exist")
      return pokemon
    }),
  castVote: publicProcedure
    .input(z.object({
      votedFor: z.number(),
      votedAgainst: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const voteInDb = await ctx.prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        }
      })
      return {success: true, vote: voteInDb}
    }),
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),
});
