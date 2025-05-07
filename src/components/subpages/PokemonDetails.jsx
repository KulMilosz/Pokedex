import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const PokemonDetails = () => {
  const { id } = useParams();
  const isLocalPokemon = id > 150;
  const url = isLocalPokemon
    ? `http://localhost:3000/stats/${id}`
    : `https://pokeapi.co/api/v2/pokemon/${id}`;

  const { data, isLoading, error } = useFetch(url);

  if (isLoading) {
    return (
      <div className="text-center text-4xl my-10 font-semibold dark:text-white">
        Loading Pokemon details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center my-10 text-red-600">
        Error loading Pokemon data.
      </div>
    );
  }

  // Normalizacja danych z różnych źródeł
  let pokemonData;
  if (isLocalPokemon) {
    // Dane z lokalnego API
    pokemonData = {
      name: data.name,
      height: data.height,
      weight: data.weight,
      base_experience: data.baseExperience,
      abilities: [{ ability: { name: "Unknown" } }], // Lokalne Pokémony nie mają abilities
      id: data.id,
    };
  } else {
    // Dane z PokeAPI
    pokemonData = data;
  }

  const {
    name,
    height,
    weight,
    base_experience: baseExperience,
    abilities,
    id: pokemonId,
  } = pokemonData;

  const ability = abilities?.[0]?.ability?.name ?? "Unknown";

  const stats = [
    { label: "Height", value: height },
    { label: "Base Exp", value: baseExperience },
    { label: "Weight", value: weight },
    { label: "Ability", value: ability },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-around md:max-w-8xl bg-[#f6f6f8] dark:bg-gray-400 rounded-lg shadow-lg p-6 m-10 ">
      <img
        src={
          isLocalPokemon
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`
        }
        alt={name}
        className="w-64 h-64 object-contain mb-6 md:mb-0 md:mr-10"
      />
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold capitalize mb-4 text-center md:text-left md:text-4xl md:mb-6">
          {name}
        </h2>
        <ul className="space-y-2 text-lg">
          {stats.map(({ label, value }) => (
            <li key={label} className="flex justify-between">
              <span className="font-semibold">{label}:</span>{" "}
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PokemonDetails;
