import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";
import { getOptionsForVote } from "../utils/getRandomPokemon";

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsForVote()) 
  const [first, second] = ids

  const firtsPokemon = api.example.getPokemonById.useQuery( {id: first} )
  const secondPokemon = api.example.getPokemonById.useQuery( {id: second} )
  if(firtsPokemon.isLoading || secondPokemon.isLoading) return null
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
          <div className="flex justify-between items-center gap-2 max-w-2xl">
            <div className="w-200 h-200 flex flex-col items-center">
              <img className="w-[120px]" 
                src={String(firtsPokemon.data?.sprites.front_default)} />
              <h2 className="text-xl capitalize">{firtsPokemon.data?.name}</h2>
            </div>
            <div className=" text-2xl">VS</div>
            <div className="w-200 h-200 flex flex-col items-center">
              <img className="w-[120px]" 
                src={String(secondPokemon.data?.sprites.front_default)} />
              <h2 className="text-xl capitalize">{secondPokemon.data?.name}</h2>
            </div>
          </div>
        </main>
    </>
  );
};

export default Home;
