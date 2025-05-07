import { FaSun, FaMoon } from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";

const Toggle = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="inline-flex items-center cursor-pointer"
      aria-label="Toggle Dark Mode"
    >
      <div
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
          darkMode ? "bg-white" : " bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white dark:bg-gray-600 rounded-full transition-transform duration-300 ${
            darkMode ? "translate-x-full" : ""
          }`}
        />
      </div>
      <span className="ms-3 text-sm font-medium text-gray-900 flex items-center">
        {darkMode ? (
          <FaSun className="text-xl text-white" />
        ) : (
          <FaMoon className="text-xl" />
        )}
      </span>
    </button>
  );
};

export default Toggle;
