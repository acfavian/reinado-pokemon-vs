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

const PokemonListing: React.FC<{pokemon: PokemonQueryResult[number], position: number}> = (props) => {
  const { pokemon, position } = props
  return (
    <div className="py-[0.7px] w-full max-w-2xl bg-gradient-to-r from-gray-400/20 via-cyan-600 to-gray-400/20">
      <div className="p-3 py-5 flex items-center justify-start gap-3 bg-[#002035] w-full">
        <div className="opacity-70 pr-5">{position}°</div>
        <Image 
          src={pokemon.spriteUrl} 
          alt={pokemon.name}
          width={62}
          height={62}
          loading="lazy"
          />
        <div className="capitalize text-xl opacity-80">
          {pokemon.name}
        </div>
        {/* <div>{pokemon._count.voteFor}</div>
        <div>{pokemon._count.voteAgainst}</div> */}
        <div className="ml-auto">{generateCountPercent(pokemon)}%</div>
      </div>
    </div>
  )
}

const ResultsPage: React.FC<{ pokemonList: AsyncReturnType<typeof getPokemonInOrder> }> = (props) => {
  const { pokemonList } = props
  const topThreeListPokemon = pokemonList.slice(0, 3)
  return (
    <div className="p-8 flex flex-col gap-5 items-center text-center bg-[#002035]">
      <div className="flex  w-full max-w-2xl">
        {topThreeListPokemon.map((topPokemon, index) => {
          return (
            <div key={index} 
              className={`flex h-[300px] flex-col items-center relative w-full
                ${(index === 0 ? "order-2   " : "")}
                ${(index === 1 ? "order-1  pt-10" : "")}
                ${(index === 2 ? "order-3  pt-16" : "")}`} 
              >
              <Image 
                className="z-10"
                src={topPokemon.spriteUrl} 
                alt={topPokemon.name}
                width={160}
                height={160}
              />
              {/* <div className="absolute h-[50px] top-8 z-[1] w-full bg-slate-500 rounded-full "></div> */}
              <div className={`h-full z-[1] w-full pt-3 flex justify-center  text-[2.6rem] font-black leading-none
                ${(index === 0 ? "bg-yellow-400  " : "")}
                ${(index === 1 ? "bg-gray-500  " : "")}
                ${(index === 2 ? "bg-amber-600 " : "")}
              `}>
                {index === 0 && <p className="">1st</p>}
                {index === 1 && <p className="">2nd</p>}
                {index === 2 && <p className="">3rd</p>}
              </div>
            </div>
          )
        })}
      </div>
      <h2 className="px-5 text-xl opacity-90">Top 3 temporal. El Pokémon mas bello es:  <span className="px-4 mx-2 py-0.5 font-semibold bg-cyan-700 capitalize">{pokemonList[0]?.name}</span> con {pokemonList[0]?._count.voteFor} votos</h2>
      <h2 className="pt-8 text-2xl text-cyan-300 opacity-70">Lista resultados:</h2>
      <div className="w-full rounded-sm flex flex-col items-center">
        {pokemonList.map((currentPokemon, index) => {
          return <PokemonListing pokemon={currentPokemon} position={index + 1} key={index} />
        })}  
      </div>
    </div>
  )
}

export default ResultsPage

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrderedBy = await getPokemonInOrder()
  return { props: { pokemonList: pokemonOrderedBy }, revalidate: 60 } 
}