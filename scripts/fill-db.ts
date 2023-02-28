import { PokemonClient } from "pokenode-ts";
import { PrismaClient } from "@prisma/client";

const doBackFill = async () => {
  const prisma = new PrismaClient()
  const pokeApi = new PokemonClient()

  const allPokemon = await pokeApi.listPokemons(0, 493)

  const formattedPokemon = allPokemon.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string}).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`
  }))

  const creation = await prisma.pokemon.createMany({
      data: formattedPokemon,
    })
    // const creation = await prisma.pokemon.deleteMany()
  console.log("Creation?", creation)
}

doBackFill()