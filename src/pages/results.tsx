import { GetServerSideProps } from "next"
import Image from "next/image"
import { prisma } from "../server/db"
import { AsyncReturnType } from "../utils/ts-bs"

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      voteFor: {_count: "desc"}
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          voteFor: true, 
          voteAgainst: true
        }
      }
    },
  })
}
type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const {voteFor ,voteAgainst} = pokemon._count
  if(voteFor + voteAgainst === 0) {
    return 0
  }
  return (voteFor / ( voteFor + voteAgainst)) * 100
}

const PokemonListing: React.FC<{pokemon: PokemonQueryResult[number]}> = (props) => {
  const { pokemon } = props
  return (
    <div className="py-[0.7px] w-full max-w-2xl bg-gradient-to-r from-gray-400/20 via-cyan-600 to-gray-400/20">
      <div className="p-3 py-5 flex items-center justify-start gap-3 bg-[#002035] w-full">
        <Image 
          src={pokemon.spriteUrl} 
          alt={pokemon.name}
          width={42}
          height={42}
          loading="lazy"
          />
        <div className="capitalize text-xl opacity-80">
          {pokemon.name}
        </div>
        <div className="ml-auto">{generateCountPercent(pokemon) + "%"}</div>
      </div>
    </div>
  )
}

const ResultsPage: React.FC<{ pokemon: AsyncReturnType<typeof getPokemonInOrder> }> = (props) => {
  return (
    <div className="p-8 flex flex-col gap-8 items-center bg-[#002035]">
      <h2 className=" text-2xl">Resultados</h2>
      <div className="w-full rounded-sm flex flex-col items-center">
        {props.pokemon.map((currentPokemon, index) => {
          return <PokemonListing pokemon={currentPokemon} key={index} />
        })}  
      </div>
    </div>
  )
}

export default ResultsPage

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrderedBy = await getPokemonInOrder()
  return { props: { pokemon: pokemonOrderedBy }, revalidate: 60 } 
}