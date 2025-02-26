"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";

interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  hoverImage: string;
  types: string[];
}

interface PokemonType {
  type: {
    name: string;
  };
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  const fetchPokemons = async (newOffset: number) => {
    const limit = 20; // Load 20 at a time
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${newOffset}`
    );

    const newPokemons = await Promise.all(
      res.data.results.map(async (poke: { name: string; url: string }) => {
        const id = poke.url.split("/").filter(Boolean).pop();
        const details = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        return {
          name: poke.name,
          url: poke.url,
          id: Number(id),
          image: details.data.sprites.front_default, // Default image
          hoverImage:
            details.data.sprites.other["official-artwork"].front_default, // Image on hover
          types: details.data.types.map((t: PokemonType) => t.type.name),
        };
      })
    );

    setPokemons((prev) => {
      // Filter out duplicates before setting the state
      const uniquePokemons = [
        ...prev,
        ...newPokemons.filter(
          (newPoke) => !prev.some((prevPoke) => prevPoke.id === newPoke.id)
        ),
      ];

      return uniquePokemons;
    });

    setOffset(newOffset + limit);

    if (newPokemons.length < limit) setHasMore(false);
  };

  useEffect(() => {
    fetchPokemons(0);
  }, []);

  const filtegreenPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full h-72 relative">
        <Image
          src="/banner.jpg" // Replace with your actual image filename
          alt="Pokemon Explorer Banner"
          layout="fill" // Makes the image cover the div
          objectFit="cover" // Ensures the image covers the entire div without distortion
          priority // Loads the image faster
        />
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mt-6">
        <input
          type="text"
          placeholder="Search for a Pokemon..."
          className="w-3/4 md:w-1/2 p-3 border-2 border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Pokemon Grid with Infinite Scroll */}
      <InfiniteScroll
        dataLength={pokemons.length}
        next={() => fetchPokemons(offset)}
        hasMore={hasMore}
        loader={<p className="text-center text-green-500 my-4">Loading...</p>}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
          {filtegreenPokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              onClick={() => router.push(`/pokemon/${pokemon.id}`)}
              className="bg-green-100 p-4 rounded-lg shadow-md transition transform hover:scale-105 cursor-pointer"
            >
              <div className="relative flex justify-center group h-[120px]">
                {/* Default Image (Visible Initially) */}
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  className="absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />

                {/* Hover Image (Hidden Initially) */}
                <Image
                  src={pokemon.hoverImage}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              </div>

              <h2 className="text-lg font-bold text-green-700 text-center capitalize mt-2">
                {pokemon.name}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Type:{" "}
                {pokemon.types
                  .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
