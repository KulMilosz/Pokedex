import React, { useState, useMemo } from "react";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import PokemonCard from "../shared/PokemonCard";
import PokemonCardLoading from "../shared/PokemonCardLoading";
import { Crown, ArrowUp, ArrowDown } from "lucide-react";

const Ranking = () => {
  const { updatedPokemons, isLoading, pokemonStats } = usePokemonContext(); // używamy updatedPokemons
  const [selectedFilter, setSelectedFilter] = useState("height");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortedPokemons = useMemo(() => {
    if (!updatedPokemons) return [];

    const pokemonsWithStats = updatedPokemons.map((pokemon) => {
      const stats = pokemonStats.find((stat) => stat.id === pokemon.id);
      return {
        ...pokemon,
        arenaFights: stats ? (stats.W || 0) + (stats.L || 0) : 0,
        arenaWins: stats ? stats.W || 0 : 0,
        arenaLosses: stats ? stats.L || 0 : 0,
      };
    });

    const filteredPokemons =
      selectedFilter === "arenaFights" ||
      selectedFilter === "arenaWins" ||
      selectedFilter === "arenaLosses"
        ? pokemonsWithStats.filter(
            (pokemon) =>
              pokemon.arenaFights > 0 ||
              pokemon.arenaWins > 0 ||
              pokemon.arenaLosses > 0
          )
        : pokemonsWithStats;

    return [...filteredPokemons].sort((a, b) => {
      let direction = 0;

      switch (selectedFilter) {
        case "height":
          direction = b.height - a.height;
          break;
        case "weight":
          direction = b.weight - a.weight;
          break;
        case "baseExp":
          direction = b.baseExperience - a.baseExperience;
          break;
        case "arenaFights":
          direction = b.arenaFights - a.arenaFights;
          break;
        case "arenaWins":
          direction = b.arenaWins - a.arenaWins;
          break;
        default:
          return 0;
      }

      return sortDirection === "desc" ? direction : -direction;
    });
  }, [updatedPokemons, selectedFilter, pokemonStats, sortDirection]);

  return (
    <div>
      <div className="text-2xl mb-5 flex justify-center">
        <div className="flex space-x-2 items-center dark:text-white">
          <Crown className="text-yellow-500 fill-yellow-400 dark:text-amber-300 dark:fill-amber-200" />
          <h1 className="font-bold">Leaderboard</h1>
          <Crown className="text-yellow-500 fill-yellow-400 dark:text-amber-300 dark:fill-amber-200" />
        </div>
      </div>

      <div className="flex justify-center items-center space-x-2 mb-4 dark:text-white">
        <span>Sort by:</span>
        <select
          className="border-2 rounded-lg "
          name="selectedFilter"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option className="bg-gray-600" value="height">
            Height
          </option>
          <option className="bg-gray-600" value="baseExp">
            Base Exp
          </option>
          <option className="bg-gray-600" value="weight">
            Weight
          </option>
          <option className="bg-gray-600" value="arenaFights">
            Total Fights
          </option>
          <option className="bg-gray-600" value="arenaWins">
            Wins/Loses
          </option>
        </select>

        <button
          onClick={toggleSortDirection}
          className="p-1 rounded-lg border-2 flex items-center"
          aria-label="Toggle sort direction"
        >
          {sortDirection === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>

      {isLoading ? (
        <ul className="flex flex-col">
          {[...Array(15)].map((_, i) => (
            <PokemonCardLoading key={i} className="w-400 h-20" />
          ))}
        </ul>
      ) : (
        <ul>
          {sortedPokemons.map((pokemon, index) => (
            <PokemonCard
              key={pokemon.id}
              {...pokemon}
              arenaFights={pokemon.arenaFights}
              index={index}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ranking;
