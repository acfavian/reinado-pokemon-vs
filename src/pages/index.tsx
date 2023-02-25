import { inferRouterOutputs } from "@trpc/server";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import type React from "react";
import { AppRouter } from "../server/api/root";
import { api, RouterOutputs } from "../utils/api";
import { getOptionsForVote } from "../utils/getRandomPokemon";

const btn1 = "text-white bg-gradient-to-br from-teal-600 to-indigo-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"

const btn = "text-white bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-400/30 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsForVote()) 
  const [first, second] = ids

  const firtsPokemon = api.example.getPokemonById.useQuery( {id: first} )
  const secondPokemon = api.example.getPokemonById.useQuery( {id: second} )
  if(firtsPokemon.isLoading || secondPokemon.isLoading) return null

  const voteForBeauty = (selected: number) => {
    // todo: fire mutation to persist changes
    setIds(getOptionsForVote())
  }

  return (
    <>
      <Head>
        <title>Reinado Pokemon</title>
        <meta name="description" content="Aplicación simple que muestra cual es el pokemon mas bello." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="p-2 min-h-screen w-screen flex flex-col justify-center items-center">
          <h1 className="text-2xl text-center pb-8">
            ¿Cual Pokémon es más bello?
          </h1>
          <div className="flex justify-between items-center gap-5 max-w-2xl">        
            {
              !firtsPokemon.isLoading && 
              firtsPokemon.data && 
              !secondPokemon.isLoading &&
              secondPokemon.data && (
              <>
                <PokemonListing 
                  pokemon={firtsPokemon.data} 
                  vote={() => voteForBeauty(first)} 
                />
                <div className=" text-2xl">VS</div>
                <PokemonListing 
                  pokemon={secondPokemon.data} 
                  vote={() => voteForBeauty(second)} 
                />
              </>
            )}
          </div>
        </main>
    </>
  );
};

export default Home;


type RouterOutput = inferRouterOutputs<AppRouter>
type PokemonFromServer = RouterOutput["example"]["getPokemonById"]


const PokemonListing: React.FC<{pokemon: PokemonFromServer, vote: () => void}> = (props) =>  {
  return (
    <div className="w-200 h-200 flex flex-col gap-5 items-center">
      <img className="w-[120px]" 
        src={String(props.pokemon.sprites.front_default)} />
      <h2 className="text-xl capitalize">{props.pokemon.name}</h2>
      <button onClick={() => props.vote()} className={btn1}>es más bello</button>
    </div>
  )
}

{/* <div className="w-200 h-200 flex flex-col gap-5 items-center">
<img className="w-[120px]" 
  src={String(firtsPokemon.data?.sprites.front_default)} />
<h2 className="text-xl capitalize">{firtsPokemon.data?.name}</h2>
<button onClick={() => voteForBeauty(first)} className={btn1}>es más bello</button>
</div>
<div className=" text-2xl">VS</div>

<div className="w-200 h-200 flex flex-col gap-5 items-center">
<img className="w-[120px]" 
  src={String(secondPokemon.data?.sprites.front_default)} />
<h2 className="text-xl capitalize">{secondPokemon.data?.name}</h2>
<button onClick={() => voteForBeauty(second)} className={btn1}>es más bello</button>
</div> */}