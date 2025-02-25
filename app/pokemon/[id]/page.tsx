import Image from "next/image";
import { notFound } from "next/navigation";

interface PokemonType {
  type: { name: string };
}

interface PokemonAbility {
  ability: { name: string };
}

interface PokemonStat {
  stat: { name: string };
  base_stat: number;
}

interface PokemonMove {
  move: { name: string };
}

interface PokemonData {
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: PokemonMove[];
  sprites: {
    other: {
      "official-artwork": { front_default: string };
    };
  };
}

interface PokemonDetailProps {
  params: { id: string };
}

// Fetch Function with Correct Type
const getPokemonDetails = async (id: string): Promise<PokemonData | null> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) return null; // Handle invalid Pokémon IDs
  return res.json();
};

export default async function PokemonDetailPage({
  params,
}: PokemonDetailProps) {
  const pokemon = await getPokemonDetails(params.id);

  if (!pokemon) return notFound(); // Show 404 page if no data found

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-green-700 capitalize">
        {pokemon.name}
      </h1>

      {/* Pokemon Image & Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 my-6">
        {/* Left Section: Pokemon Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            width={200}
            height={200}
            className="drop-shadow-lg"
          />
        </div>

        {/* Right Section: Basic Info */}
        <div className="w-full md:w-1/2 bg-green-100 p-4 rounded-lg shadow">
          <p className="text-gray-700">
            <strong>Type:</strong>{" "}
            {pokemon.types
              .map(
                (t) =>
                  t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
              )
              .join(", ")}
          </p>
          <p className="text-gray-700">
            <strong>Abilities:</strong>{" "}
            {pokemon.abilities
              .map(
                (a) =>
                  a.ability.name.charAt(0).toUpperCase() +
                  a.ability.name.slice(1)
              )
              .join(", ")}
          </p>
          <p className="text-gray-700">
            <strong>Height:</strong> {pokemon.height / 10} m
          </p>
          <p className="text-gray-700">
            <strong>Weight:</strong> {pokemon.weight / 10} kg
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-green-700">Base Stats</h2>
        <div className="grid grid-cols-2 gap-4 mt-3">
          {pokemon.stats.map((s) => (
            <div
              key={s.stat.name}
              className="bg-white p-3 rounded-lg shadow-md"
            >
              <p className="text-sm font-semibold text-gray-600 capitalize">
                {s.stat.name}
              </p>
              <div className="h-3 bg-green-200 rounded-full mt-1">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${s.base_stat}%`, maxWidth: "100%" }}
                ></div>
              </div>
              <p className="text-sm font-bold text-green-700 mt-1">
                {s.base_stat}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Moves */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-green-700">Moves</h2>
        <div className="bg-green-100 p-4 rounded-lg shadow mt-3">
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 list-disc pl-5">
            {pokemon.moves.slice(0, 15).map((m, index) => (
              <li key={index} className="text-gray-700 capitalize">
                {m.move.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
