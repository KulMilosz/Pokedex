import React, { useState } from "react";
import { createPortal } from "react-dom";
import PokemonCard from "../shared/PokemonCard";
import PokemonCardLoading from "../shared/PokemonCardLoading";
import Modal from "../shared/Modal";
import useFetch from "../../hooks/useFetch";
import useMutate from "../../hooks/useMutate";
import { useNavigate } from "react-router-dom";
import { Swords } from "lucide-react";

const Arena = () => {
  const {
    data: arena = [],
    error,
    isLoading,
  } = useFetch("http://localhost:3000/arena");

  const { data: stats = [] } = useFetch("http://localhost:3000/stats");

  const [firstPokemonId, setFirstPokemonID] = useState(null);
  const [secondPokemonId, setSecondPokemonID] = useState(null);
  const [isModalShown, setIsModalShown] = useState(false);
  const [winner, setWinner] = useState(null);

  const { mutate: removeArena1 } = useMutate(
    firstPokemonId ? `http://localhost:3000/arena/${firstPokemonId}` : null,
    "DELETE",
    ["arena"]
  );

  const { mutate: removeArena2 } = useMutate(
    secondPokemonId ? `http://localhost:3000/arena/${secondPokemonId}` : null,
    "DELETE",
    ["arena"]
  );

  const { mutate: updateStat } = useMutate(
    "http://localhost:3000/stats",
    "PATCH",
    ["stats"]
  );

  const { mutate: createStat } = useMutate(
    "http://localhost:3000/stats",
    "POST",
    ["stats"]
  );

  const getCardOrPlaceholder = (index) => {
    if (arena[index]) {
      return <PokemonCard key={arena[index].id} {...arena[index]} />;
    } else {
      return (
        <PokemonCardLoading
          key={`placeholder-${index}`}
          className="border-4 border-gray-400 dark:border-gray-100"
        />
      );
    }
  };

  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalShown(false);

    removeArena1();
    removeArena2();
    navigate("/");
  };

  const updateOrCreateStat = (pokemonId, result, pokemonExp) => {
    const existingStat = stats.find((stat) => stat.id === pokemonId);

    if (existingStat) {
      const updatedExp =
        result === "W"
          ? existingStat.baseExperience + 10
          : existingStat.baseExperience;
      updateStat({
        id: pokemonId,
        [result]: existingStat[result] + 1,
        baseExperience: updatedExp,
      });
    } else {
      createStat({
        id: pokemonId,
        W: result === "W" ? 1 : 0,
        L: result === "L" ? 1 : 0,
        baseExperience: result === "W" ? pokemonExp + 10 : pokemonExp,
      });
    }
  };

  const startFight = async () => {
    if (arena.length === 2) {
      const [pokemon1, pokemon2] = arena;

      const score1 = pokemon1.baseExperience * pokemon1.weight;
      const score2 = pokemon2.baseExperience * pokemon2.weight;

      setFirstPokemonID(pokemon1.id);
      setSecondPokemonID(pokemon2.id);

      try {
        if (score1 > score2) {
          setWinner(pokemon1);
          await Promise.all([
            updateOrCreateStat(pokemon1.id, "W", pokemon1.baseExperience),
            updateOrCreateStat(pokemon2.id, "L", pokemon2.baseExperience),
          ]);
          setIsModalShown(true);
        } else if (score2 > score1) {
          setWinner(pokemon2);
          await Promise.all([
            updateOrCreateStat(pokemon2.id, "W", pokemon2.baseExperience),
            updateOrCreateStat(pokemon1.id, "L", pokemon1.baseExperience),
          ]);
          setIsModalShown(true);
        } else {
          setIsModalShown(true);
        }
      } catch (error) {
        console.error("Error during fight:", error);
        alert("An error occurred during the fight");
      }
    } else {
      alert("Not enough Pokemon on the arena to start the fight!");
    }
  };

  const renderCenterText = () => {
    if (arena.length === 0) {
      return (
        <>
          <span className="text-2xl font-semibold mb-2 dark:text-white">
            No arena Pokemon found
          </span>
          <p className="text-lg dark:text-white">
            Add some by clicking the{" "}
            <Swords className="inline text-blue-500 w-5 h-5" fill="blue" /> on a
            Pokemon card
          </p>
        </>
      );
    }

    if (arena.length === 1) {
      return (
        <>
          <span className="text-2xl font-semibold mb-2 dark:text-white">
            Add 1 more Pokemon to start the fight!
          </span>
          <p className="text-lg dark:text-white">
            Click the{" "}
            <Swords className="inline text-blue-500 w-5 h-5" fill="blue" /> on a
            Pokemon card
          </p>
        </>
      );
    }

    return (
      <>
        <span className="text-2xl font-semibold mb-2 dark:text-white">
          Click swords to start the fight!
        </span>
      </>
    );
  };

  return (
    <div>
      {error && (
        <div className="text-center text-red-500">
          Error loading Pokemon data
        </div>
      )}

      {isLoading ? (
        <ul className="gridPokemonList">
          {[...Array(2)].map((_, i) => (
            <PokemonCardLoading key={i} />
          ))}
        </ul>
      ) : (
        <div className="gridPokemonList">
          {getCardOrPlaceholder(0)}
          <div className="flex flex-col justify-center items-center text-center px-4">
            <button
              onClick={() => startFight()}
              disabled={arena.length !== 2}
              className="w-12 h-12 mb-4"
            >
              <Swords
                className="text-blue-500 w-12 h-12 cursor-pointer"
                fill={arena.length !== 2 ? "gray" : "blue"}
              />
            </button>

            {renderCenterText()}
          </div>
          {getCardOrPlaceholder(1)}
        </div>
      )}
      {isModalShown &&
        createPortal(
          <Modal winner={winner} onClose={handleCloseModal} arena />,
          document.body
        )}
    </div>
  );
};

export default Arena;
