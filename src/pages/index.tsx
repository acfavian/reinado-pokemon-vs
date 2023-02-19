import { type NextPage } from "next";
import Head from "next/head";
import { getOptionsForVote } from "../utils/getRandomPokemon";

const Home: NextPage = () => {

  const [first, second] = getOptionsForVote()
  return (
    <>
      <Head>
        <title>Reinado Pokemon</title>
        <meta name="description" content="Aplicación simple que muestra cual es el pokemon mas bello." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="min-h-screen w-screen flex flex-col justify-center items-center">
          <h1 className="text-2xl text-center pb-8">
            ¿Cual Pokémon es más bello?
          </h1>
          <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
            <div className="w-16 h-16 bg-red-200">{first}</div>
            <div className="p-8">VS</div>
            <div className="w-16 h-16 bg-red-200">{second}</div>
          </div>
        </main>
    </>
  );
};

export default Home;
