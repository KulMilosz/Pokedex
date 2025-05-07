/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [updatedPokemons, setUpdatedPokemons] = useState([]);
  const [error, setError] = useState(null);

  const {
    data,
    isLoading,
    error: fetchError,
  } = useFetch("https://pokeapi.co/api/v2/pokemon/?limit=150");

  const { data: pokemonStats = [] } = useFetch("http://localhost:3000/stats");

  const updatePokemons = (allPokemons, pokemonStats) => {
    const updated = allPokemons.map((pokemon) => {
      const pokemonInStats = pokemonStats.find(
        (stat) => stat.id === pokemon.id
      );

      if (pokemonInStats) {
        return {
          ...pokemon,
          baseExperience:
            pokemonInStats.baseExperience ?? pokemon.baseExperience,
          height: pokemonInStats.height ?? pokemon.height,
          weight: pokemonInStats.weight ?? pokemon.weight,
        };
      }
      return pokemon;
    });

    const newPokemons = pokemonStats
      .filter(
        (stat) => stat.id > 150 && !allPokemons.some((p) => p.id === stat.id)
      )
      .map((stat) => ({
        id: stat.id,
        name: stat.name,
        height: stat.height,
        weight: stat.weight,
        baseExperience: stat.baseExperience,
      }));

    return [...updated, ...newPokemons];
  };

  useEffect(() => {
    if (data) {
      const fetchDetails = async () => {
        try {
          const details = await Promise.all(
            data.results.map(async (pokemon) => {
              const pokemonResponse = await fetch(pokemon.url);
              const pokemonData = await pokemonResponse.json();
              return {
                name: pokemon.name,
                height: pokemonData.height,
                baseExperience: pokemonData.base_experience,
                weight: pokemonData.weight,
                ability: pokemonData.abilities[0].ability.name,
                id: pokemonData.id,
              };
            })
          );

          const updatedPokemons = updatePokemons(details, pokemonStats);
          setUpdatedPokemons(updatedPokemons);
          setAllPokemons(details);
        } catch (error) {
          setError(error);
        }
      };

      fetchDetails();
    }
  }, [data, pokemonStats]);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  return (
    <PokemonContext.Provider
      value={{
        allPokemons,
        updatedPokemons,
        pokemonStats,
        isLoading,
        error,
        setUpdatedPokemons,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
