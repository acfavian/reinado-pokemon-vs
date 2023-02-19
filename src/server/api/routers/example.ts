import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({
      text: z.string().nullish(),
    }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  // input: z
  //   .object({
  //     text:_ z.string().nullish(),
  //   })
  //   .nullish(),
  //   resolve({ input }) {
  //     return {
  //       greeting: `hello ${input?.text ?? "world"}`
  //     }
  //   }
});
