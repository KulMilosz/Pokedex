import React from "react";
import PokemonCard from "../shared/PokemonCard";
import PokemonCardLoading from "../shared/PokemonCardLoading";
import useFetch from "../../hooks/useFetch";
import { Heart } from "lucide-react";

const Favorites = () => {
  const {
    data: favorites = [],
    error,
    isLoading,
  } = useFetch("http://localhost:3000/favorites");

  return (
    <div>
      {error && (
        <div className="text-center text-red-500">
          Error loading Pokemon data
        </div>
      )}

      {isLoading ? (
        <ul className="gridPokemonList">
          {[...Array(favorites.length || 6)].map((_, i) => (
            <PokemonCardLoading key={i} />
          ))}
        </ul>
      ) : favorites.length > 0 ? (
        <ul className="gridPokemonList">
          {favorites.map((favorite) => (
            <PokemonCard key={favorite.id} {...favorite} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col justify-center items-center h-[50vh] text-center px-4">
          <Heart className="text-red-700 w-12 h-12 mb-4" fill="red" />
          <span className="text-2xl font-semibold mb-2 dark:text-white">
            No favorites Pokemon found
          </span>
          <p className="text-lg dark:text-white">
            Add some by clicking the {""}
            <Heart className="inline text-red-700 w-5 h-5" fill="red " /> on a
            Pokemon card
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
