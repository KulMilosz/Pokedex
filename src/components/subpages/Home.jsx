import { useState } from "react";
import PokemonList from "../shared/PokemonList";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-3/4 m-5 md:w-2/4">
          <input
            id="homeSearch"
            type="text"
            placeholder="Search for Pokemon"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 placeholder:text-center insideStyle border-gray-700 dark:border-gray-500 bg-gray-300 dark:bg-gray-300 dark:placeholder:text-gray-700  focus:outline-none "
          />
        </div>
      </div>
      <PokemonList
        searchTerm={searchTerm}
        resetPage={() => setSearchTerm("")}
      />
    </div>
  );
};

export default Home;
