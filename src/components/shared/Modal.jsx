import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { Swords, ArrowBigLeft, ArrowBigRight, X } from "lucide-react";

const Modal = ({ editPokemon, createPokemon, winner, onClose, onSubmit }) => {
  const { updatedPokemons } = usePokemonContext();
  const { register, handleSubmit } = useForm();
  const [currentPhoto, setCurrentPhoto] = useState(151);

  const handlePhotoChange = (direction) => {
    setCurrentPhoto((prev) => {
      if (direction === "left") {
        return prev > 151 ? prev - 1 : 649;
      } else if (direction === "right") {
        return prev < 649 ? prev + 1 : 151;
      }
      return prev;
    });
  };

  const onEditSubmit = (data) => {
    onSubmit(data);
  };

  const onCreateSubmit = (data) => {
    onSubmit({
      ...data,
      id: currentPhoto,
    });
  };

  const editMap = {
    height: "height",
    weight: "weight",
    "base Exp": "baseExperience",
  };

  const createMap = {
    name: "name",
    height: "height",
    weight: "weight",
    "base Exp": "baseExperience",
  };

  const isPhotoTaken = updatedPokemons.some((p) => p.id === currentPhoto);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-2xl max-w-md w-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {!winner && (
          <button
            className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-red-600 transition cursor-pointer"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="size-8" />
          </button>
        )}

        {editPokemon ? (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${editPokemon.id}.svg`}
                  alt={editPokemon.name}
                  className="object-contain h-28 w-28"
                />
              </div>
              <span className="text-2xl font-bold text-center capitalize">
                {editPokemon.name}
              </span>

              <form
                onSubmit={handleSubmit(onEditSubmit)}
                className="flex flex-col space-y-2 w-full"
              >
                {Object.keys(editMap).map((label) => {
                  const fieldName = editMap[label];
                  return (
                    <div key={label}>
                      <label
                        htmlFor={fieldName}
                        className="block font-medium capitalize"
                      >
                        {label}:
                      </label>
                      <input
                        id={fieldName}
                        {...register(fieldName)}
                        defaultValue={editPokemon[fieldName]}
                        type="number"
                        className="border px-2 py-1 rounded w-full"
                      />
                    </div>
                  );
                })}
                <button
                  type="submit"
                  className="mt-6 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 cursor-pointer"
                >
                  Save attributes
                </button>
              </form>
            </div>
          </>
        ) : createPokemon ? (
          <>
            <div className="flex justify-center items-center m-5 space-x-5">
              <ArrowBigLeft
                className="size-10 cursor-pointer select-none focus:outline-none"
                onClick={() => handlePhotoChange("left")}
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${currentPhoto}.svg`}
                    className={`object-contain h-28 w-28 transition-all duration-300 ${
                      isPhotoTaken ? "opacity-50 grayscale" : ""
                    }`}
                  />
                </div>
                {isPhotoTaken && (
                  <div className="text-sm text-red-600 dark:text-red-400 font-semibold text-center">
                    This photo is already in use
                  </div>
                )}
              </div>
              <ArrowBigRight
                className="size-10 cursor-pointer select-none focus:outline-none"
                onClick={() => handlePhotoChange("right")}
              />
            </div>

            <form
              onSubmit={handleSubmit(onCreateSubmit)}
              className="flex flex-col items-center gap-4"
            >
              <div className="grid grid-cols-2 gap-4 w-full">
                {Object.keys(createMap).map((label) => {
                  const fieldName = createMap[label];
                  return (
                    <div key={label} className="flex flex-col">
                      <label
                        htmlFor={fieldName}
                        className="block font-medium capitalize"
                      >
                        {label}:
                      </label>
                      <input
                        id={fieldName}
                        {...register(fieldName)}
                        type={fieldName === "name" ? "text" : "number"}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={isPhotoTaken}
                className={`mt-6 px-4 py-2 rounded-lg w-full transition duration-300 cursor-pointer ${
                  isPhotoTaken
                    ? "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed"
                    : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                }`}
              >
                Create Pokemon
              </button>
            </form>
          </>
        ) : winner ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-500 dark:text-green-400">
              Winner!
            </h2>

            <div className="flex items-center justify-center gap-6 mb-6">
              <Swords className="w-12 h-12 text-red-600 dark:text-red-400 rotate-180" />
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${winner.id}.svg`}
                  alt={winner.name}
                  className="object-contain h-28 w-28"
                />
              </div>
              <Swords className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>

            <p className="text-xl capitalize font-bold text-gray-900 dark:text-white">
              {winner.name}
            </p>

            <button
              onClick={onClose}
              className="mt-6 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-500 dark:text-green-400">
              It's a Tie!
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
