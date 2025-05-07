import { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import PokemonCardLoading from "./PokemonCardLoading";
import { usePokemonContext } from "../../hooks/usePokemonContext";

const PokemonList = ({ searchTerm }) => {
  const { updatedPokemons, isLoading, error } = usePokemonContext();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePagination = (direction) => {
    if (
      direction === "next" &&
      currentPage < Math.ceil(updatedPokemons.length / 15)
    ) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const filteredPokemons = updatedPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPokemons = filteredPokemons.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  return (
    <div>
      {error && <div>Error loading Pokemon data</div>}

      {isLoading || updatedPokemons.length === 0 ? (
        <ul className="gridPokemonList">
          {[...Array(15)].map((_, i) => (
            <PokemonCardLoading key={i} />
          ))}
        </ul>
      ) : (
        <>
          <ul className="gridPokemonList">
            {paginatedPokemons.length > 0 ? (
              paginatedPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} {...pokemon} />
              ))
            ) : (
              <div className="text-center col-span-full text-lg font-semibold">
                No Pokemon found.
              </div>
            )}
          </ul>

          <div className="flex justify-center items-center space-x-4 my-5">
            <button
              className="pageButton"
              onClick={() => handlePagination("prev")}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <div className="text-lg font-semibold">
              Current page: {currentPage}
            </div>
            <button
              className="pageButton"
              onClick={() => handlePagination("next")}
              disabled={currentPage * 15 >= filteredPokemons.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PokemonList;
