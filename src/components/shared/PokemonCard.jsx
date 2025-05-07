import React, { useState, useEffect } from "react";
import { Heart, Swords } from "lucide-react";
import { useLoginContext } from "../../hooks/useLoginContext";
import useFetch from "../../hooks/useFetch";
import useMutate from "../../hooks/useMutate";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { useSnackbar } from "notistack";
import { useNavigate, useLocation } from "react-router-dom";

const PokemonCard = ({
  name,
  height,
  baseExperience,
  weight,
  ability,
  id,
  index,
  handleEdit,
}) => {
  const { pokemonStats } = usePokemonContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInArena, setIsInArena] = useState(false);
  const [ispokemonStats, setIspokemonStats] = useState(false);
  const [arenaCount, setArenaCount] = useState(0);
  const { isLogged } = useLoginContext();

  const { data: favorites = [] } = useFetch("http://localhost:3000/favorites");
  const { data: arena = [] } = useFetch("http://localhost:3000/arena");

  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: addFavorite } = useMutate(
    "http://localhost:3000/favorites",
    "POST",
    ["favorites"]
  );
  const { mutate: removeFavorite } = useMutate(
    `http://localhost:3000/favorites/${id}`,
    "DELETE",
    ["favorites"]
  );

  const { mutate: addArena } = useMutate(
    "http://localhost:3000/arena",
    "POST",
    ["arena"]
  );
  const { mutate: removeArena } = useMutate(
    `http://localhost:3000/arena/${id}`,
    "DELETE",
    ["arena"]
  );

  const currentPokemonStats = pokemonStats.find((stat) => stat.id === id);
  const finalBaseExperience = currentPokemonStats
    ? currentPokemonStats.baseExperience
    : baseExperience;

  useEffect(() => {
    setIsFavorite(favorites.some((favorite) => favorite.id === id));
    setIsInArena(arena.some((arenaItem) => arenaItem.id === id));
    setIspokemonStats(pokemonStats.some((arenaStat) => arenaStat.id === id));

    setArenaCount(arena.length);
  }, [favorites, arena, pokemonStats, id]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      removeFavorite();
      enqueueSnackbar(
        <span className="flex items-center">
          Removed <span className="font-bold mx-1">{name}</span> from favorites!
          <Heart className="ml-2 text-red-500 fill-red-500" />
        </span>,
        {
          variant: "success",
          autoHideDuration: 2000,
        }
      );
    } else {
      addFavorite({ id, name, height, baseExperience, weight, ability });
      enqueueSnackbar(
        <span className="flex items-center">
          Added <span className="font-bold mx-1">{name}</span> to favorites!
          <Heart className="ml-2 text-red-500 fill-red-500" />
        </span>,
        {
          variant: "success",
          autoHideDuration: 2000,
        }
      );
    }
  };

  const toggleArena = async () => {
    if (isInArena) {
      removeArena();
      enqueueSnackbar(
        <span className="flex items-center">
          Removed <span className="font-bold mx-1">{name}</span> from the arena!
          <Swords className="ml-2 text-blue-500 fill-blue-500" />
        </span>,
        {
          variant: "success",
          autoHideDuration: 2000,
        }
      );
    } else {
      if (arenaCount >= 2) {
        enqueueSnackbar(
          <span className="flex items-center">
            Arena is full! Remove a Pokemon first.
            <Swords className="ml-2 text-gray-500 fill-gray-500" />
          </span>,
          {
            variant: "warning",
            autoHideDuration: 2000,
          }
        );
        return;
      }

      addArena({ id, name, height, baseExperience, weight, ability });
      enqueueSnackbar(
        <span className="flex items-center">
          Added <span className="font-bold mx-1">{name}</span> to the arena!
          <Swords className="ml-2 text-blue-500 fill-blue-500" />
        </span>,
        {
          variant: "success",
          autoHideDuration: 2000,
        }
      );
    }
  };

  const stats = [
    { label: "Height", value: height },
    { label: "Base Exp", value: finalBaseExperience },
    { label: "Weight", value: weight },
    { label: "Ability", value: ability },
  ];

  const isFavoritesPage = location.pathname.includes("favorites");
  const isArenaPage = location.pathname.includes("arena");
  const isRankingPage = location.pathname.includes("ranking");
  const isEditPage = location.pathname.includes("edit");
  const isHomePage = location.pathname === "/";

  if (isEditPage) {
    return (
      <div className="rounded-lg bg-[#f6f6f8] dark:bg-gray-400 shadow-md m-2 overflow-hidden p-4 gap-4 transition-transform duration-300 transform hover:scale-105">
        <div className="flex flex-col md:flex-row items-center gap-4 md:justify-between">
          <span className="text-sky-600 font-extrabold text-xl">
            #{index + 1}
          </span>
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`}
              alt={name}
              className="object-contain h-full w-full"
            />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold capitalize">{name}</h2>
          </div>
          <div className="flex justify-center items-center">
            <button
              className=" w-20 md:w-12 h-8 border-2 rounded-xl bg-sky-600 text-white border-sky-500 hover:bg-sky-800 cursor-pointer "
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isRankingPage) {
    return (
      <div className="w-11/12 md:w-3/4 mx-auto rounded-lg bg-[#f6f6f8] dark:bg-gray-400 shadow-md m-2 overflow-hidden flex flex-col md:flex-row items-center md:justify-between p-4 gap-4">
        <div className="flex items-center gap-4 flex-shrink-0">
          <span
            className={`${
              index === 0
                ? "text-yellow-500 font-extrabold text-2xl"
                : index === 1
                ? "text-gray-300 font-extrabold text-xl"
                : index === 2
                ? "text-orange-500 font-extrabold text-xl"
                : "text-sky-600 font-extrabold text-xl"
            }`}
          >
            #{index + 1}
          </span>{" "}
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`}
              alt={name}
              className="object-contain h-full w-full"
            />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold capitalize">{name}</h2>

            {isLogged &&
              currentPokemonStats &&
              (currentPokemonStats.W > 0 || currentPokemonStats.L > 0) && (
                <div className="flex gap-2 mt-1">
                  <div className="rounded-lg bg-gray-300 dark:bg-gray-600 dark:text-white text-xs px-2 py-1">
                    W: {currentPokemonStats.W}
                  </div>
                  <div className="rounded-lg bg-gray-300 dark:bg-gray-600 dark:text-white text-xs px-2 py-1">
                    L: {currentPokemonStats.L}
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow text-sm justify-items-center md:justify-items-end">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center min-w-16">
              <div className="text-gray-700">{value}</div>
              <span className="text-gray-900 font-bold text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[400px] max-h-[500px] mx-auto rounded-lg bg-[#f6f6f8] dark:bg-gray-400 shadow-xl m-5 overflow-hidden transition-transform duration-300 transform hover:scale-105">
      {isLogged && (
        <>
          {(isFavoritesPage || isHomePage) && (
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 z-10 cursor-pointer"
            >
              <Heart
                className={`size-10 transition-colors duration-200 ${
                  isFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-100 fill-gray-400 dark:text-white dark:fill-white"
                }`}
              />
            </button>
          )}
          {(isArenaPage || isHomePage) && !isRankingPage && (
            <div className="absolute top-4 left-3 z-10 flex flex-col items-center gap-1">
              <button onClick={toggleArena} className="cursor-pointer">
                <Swords
                  className={`size-9 transition-colors duration-200 ${
                    isInArena
                      ? "text-blue-500 fill-blue-500"
                      : "text-gray-400 fill-gray-400 dark:text-white dark:fill-white"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700 dark:text-white cursor-default">
                {arenaCount}/2
              </span>

              {ispokemonStats &&
                currentPokemonStats &&
                !isRankingPage &&
                (currentPokemonStats.W > 0 || currentPokemonStats.L > 0) && (
                  <div className="rounded-xl size-10 md:size-12 flex flex-col justify-center p-1 bg-gray-300 dark:bg-gray-600 dark:text-white text-xs">
                    <span>W: {currentPokemonStats.W}</span>
                    <span>L: {currentPokemonStats.L}</span>
                  </div>
                )}
            </div>
          )}
        </>
      )}

      <div
        className="w-full h-80 flex items-center justify-center p-10"
        onClick={() => isHomePage && navigate(`${id}`)}
      >
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`}
          alt={name}
          className="object-contain h-full w-full"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-center capitalize">
          {name}
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm p">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-gray-700 ">{value}</div>
              <span className="text-gray-900 font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
