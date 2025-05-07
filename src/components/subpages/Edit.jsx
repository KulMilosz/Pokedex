import React, { useState } from "react";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import PokemonCard from "../shared/PokemonCard";
import { createPortal } from "react-dom";
import Modal from "../shared/Modal";
import useMutate from "../../hooks/useMutate";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Edit = () => {
  const { updatedPokemons, setUpdatedPokemons } = usePokemonContext();
  const [pokemonToEdit, setPokemonToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const statsMutation = useMutate("http://localhost:3000/stats", "PATCH", [
    "stats",
  ]);
  const statsPost = useMutate("http://localhost:3000/stats", "POST", ["stats"]);
  const favoritesMutation = useMutate(
    "http://localhost:3000/favorites",
    "PATCH",
    ["favorites"]
  );
  const arenaMutation = useMutate("http://localhost:3000/arena", "PATCH", [
    "arena",
  ]);

  const handleEdit = (pokemon) => {
    setPokemonToEdit({ ...pokemon });
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setPokemonToEdit(null);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
  };

  const handleSave = async (updatedData) => {
    if (!updatedData) return;

    const updated = updatedPokemons.map((p) =>
      p.id === updatedData.id ? updatedData : p
    );
    setUpdatedPokemons(updated);

    const payload = {
      id: updatedData.id,
      name: updatedData.name,
      baseExperience: updatedData.baseExperience,
      height: updatedData.height,
      weight: updatedData.weight,
    };

    try {
      const statsRes = await fetch(
        `http://localhost:3000/stats/${updatedData.id}`
      );
      if (statsRes.ok) {
        statsMutation.mutate(payload);
      } else if (statsRes.status === 404) {
        statsPost.mutate({ ...payload, W: 0, L: 0 });
      }

      const favRes = await fetch(
        `http://localhost:3000/favorites/${updatedData.id}`
      );
      if (favRes.ok) {
        favoritesMutation.mutate(payload);
      }

      const arenaRes = await fetch(
        `http://localhost:3000/arena/${updatedData.id}`
      );
      if (arenaRes.ok) {
        arenaMutation.mutate(payload);
      }
    } catch (err) {
      console.error("Błąd przy zapisie:", err);
    }
  };

  const onEditSubmit = (data) => {
    const updatedPokemon = {
      ...pokemonToEdit,
      height: data.height,
      weight: data.weight,
      baseExperience: data.baseExperience,
    };
    handleSave(updatedPokemon);
    setIsEditModalOpen(false);
    enqueueSnackbar(
      <span>
        Attributes of{" "}
        <span className="text-yellow-400 font-bold capitalize">
          {pokemonToEdit.name}
        </span>{" "}
        has been changed.
      </span>,
      {
        variant: "success",
        autoHideDuration: 2000,
      }
    );
  };

  const onCreateSubmit = (data) => {
    handleSave(data);
    setIsCreateModalOpen(false);
    enqueueSnackbar(
      <span>
        New Pokemon{" "}
        <span className="text-yellow-400 font-bold capitalize">
          {data.name}
        </span>{" "}
        has been added.
      </span>,
      {
        variant: "success",
        autoHideDuration: 2000,
      }
    );

    navigate("/");
  };

  return (
    <>
      <div className="flex w-full justify-center mb-5 mt-5">
        <button
          onClick={handleCreate}
          className="border-2 w-80 md:w-120 h-10 rounded-2xl bg-sky-600 text-white border-sky-500 text-xl cursor-pointer"
        >
          Create Pokemon
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {updatedPokemons.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id}
            {...pokemon}
            index={index}
            handleEdit={() => handleEdit(pokemon)}
          />
        ))}

        {isEditModalOpen &&
          createPortal(
            <Modal
              editPokemon={pokemonToEdit}
              onSubmit={onEditSubmit}
              onClose={handleCloseModal}
            />,
            document.body
          )}
        {isCreateModalOpen &&
          createPortal(
            <Modal
              createPokemon={true}
              onClose={handleCloseModal}
              onSubmit={onCreateSubmit}
            />,
            document.body
          )}
      </div>
    </>
  );
};

export default Edit;
