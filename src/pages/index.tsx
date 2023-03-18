import { inferRouterOutputs } from "@trpc/server";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import type React from "react";
import { AppRouter } from "../server/api/root";
import { api } from "../utils/api";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import Image from "next/image";
import { GithubIcon } from "../icons";
import Link from "next/link";

const btn1 = "text-white bg-gradient-to-br from-teal-600 to-indigo-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsForVote()) 
  const [first, second] = ids

  const firtsPokemon = api.pokemons.getPokemonById.useQuery( {id: first} )
  const secondPokemon = api.pokemons.getPokemonById.useQuery( {id: second} )
  const voteMutation = api.pokemons.castVote.useMutation() 
  // next line side get error if the useMutation() hook is below it
  // if(firtsPokemon.isLoading || secondPokemon.isLoading) return null

  const voteForBeauty = (selected: number) => {
    // todo: fire mutation to persist changes
    if(selected === first) {
      voteMutation.mutate({votedFor: first, votedAgainst: second})
    } else {
      voteMutation.mutate({votedFor: second, votedAgainst: first})
    }
    setIds(getOptionsForVote())
  }

  const isDataLoaded =
    !firtsPokemon.isLoading && 
    firtsPokemon.data && 
    !secondPokemon.isLoading &&
    secondPokemon.data

  return (
    <>
      <Head>
        <title>Reinado Pokemon</title>
        <meta name="description" content="Aplicación simple que muestra cual es el pokemon mas bello." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="px-8 min-h-screen w-screen flex flex-col justify-center items-center">
        <Link href={"/resultados"} className="hover:underline text-xl absolute top-0 pt-8" >Ver resultados ─&gt;</Link>
          <h1 className="text-2xl text-center pb-8">
            ¿Cual Pokémon es más bello?
          </h1>
          <div className="flex justify-between items-center gap-5 max-w-2xl">        
            {isDataLoaded && (
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
            {!isDataLoaded && <Image width={110} height={110} src="ball-triangle.svg" alt="ball-triangle loader" />}
          </div>
          <a  href="https://github.com/acfavian/reinado-pokemon-vs" 
              target="_blank" 
              rel="noreferrer" 
              className="absolute bottom-0 py-5"
              >
            <GithubIcon size={40} /> 
          </a>            
        </main>
    </>
  );
};

export default Home;


type RouterOutput = inferRouterOutputs<AppRouter>
type PokemonFromServer = RouterOutput["pokemons"]["getPokemonById"]


const PokemonListing: React.FC<{pokemon: PokemonFromServer, vote: () => void}> = (props) =>  {
  return (
    <div className="w-200 h-200 flex flex-col gap-5 items-center">
      <Image 
        src={props.pokemon.spriteUrl} 
        alt={props.pokemon.name}
        width={200}
        height={200}
        />
      <h2 className="text-xl sm:text-2xl capitalize">{props.pokemon.name}</h2>
      <button onClick={() => props.vote()} className={`text-sm sm:text-xl ${btn1}`}>es más bello</button>
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