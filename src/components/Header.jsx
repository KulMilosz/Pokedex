import { NavLink, Outlet } from "react-router-dom";
import { useLoginContext } from "../hooks/useLoginContext";
import ThemeSwitch from "./shared/ThemeSwitch";
import useDarkMode from "../hooks/useDarkMode";
import { User } from "lucide-react";

const Header = () => {
  const {
    isLogged,
    userName,
    setIsMobileMenuOpen,
    isMobileMenuOpen,
    handleLogout,
  } = useLoginContext();

  const { darkMode } = useDarkMode();

  const handleHamburger = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const protectedRoutes = [
    { name: "Favorites", path: "/favorites" },
    { name: "Arena", path: "/arena" },
    { name: "Ranking", path: "/ranking" },
    { name: "Edit", path: "/edit" },
    { name: "Logout" },
  ];

  const authRoutes = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  const currentRoutes = isLogged ? protectedRoutes : authRoutes;

  // RESET
  // const resetAll = async () => {
  //   const endpoints = ["arena", "favorites", "stats"];

  //   try {
  //     for (const endpoint of endpoints) {
  //       const res = await fetch(`http://localhost:3000/${endpoint}`);
  //       const data = await res.json();

  //       for (const item of data) {
  //         await fetch(`http://localhost:3000/${endpoint}/${item.id}`, {
  //           method: "DELETE",
  //         });
  //       }
  //     }

  //     alert("Wszystkie dane zostały zresetowane.");
  //     window.location.reload(); // Odśwież stronę
  //   } catch (error) {
  //     console.error("Błąd podczas resetowania danych:", error);
  //     alert("Coś poszło nie tak podczas resetowania danych.");
  //   }
  // };

  const renderNavItem = (item) => {
    return item.path ? (
      <div
        key={item.path}
        className="flex flex-col w-full justify-center items-center"
      >
        <div className="small w-full">
          <NavLink
            onClick={handleHamburger}
            to={item.path}
            className={({ isActive }) =>
              `${
                isActive
                  ? "navLink md:text-xl text-sky-600 font-bold"
                  : "navLink md:text-xl font-medium text-gray-700 dark:text-white "
              } w-full h-full flex items-center justify-center`
            }
          >
            {item.name}
          </NavLink>
        </div>
      </div>
    ) : (
      <div key={item.name} className="small w-full">
        <button
          className="navLink md:text-xl font-medium text-gray-700 dark:text-white w-full text-center"
          onClick={handleLogout}
        >
          {item.name}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* <button
        onClick={resetAll}
        className="border-2 px-3 py-1 rounded text-red-600 dark:text-red-400 border-red-500 dark:border-red-400 hover:bg-red-100 dark:hover:bg-red-800 transition cursor-crosshair"
      >
        Reset
      </button> */}
      <div className="flex flex-col  ">
        <div className="hidden  space-x-20 justify-end px-5 pt-5 md:flex">
          {isLogged ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-sky-900/40 shadow-md ring-1 ring-sky-400/50">
              <User className="w-5 h-5 text-sky-600 dark:text-sky-400 " />
              <span className="font-semibold italic text-sky-600 cursor-default dark:text-sky-400  ">
                {userName}
              </span>
            </div>
          ) : (
            ""
          )}

          <ThemeSwitch />
        </div>
        <div className="flex justify-between w-full items-center p-5 md:mb-10 border-b-3 border-gray-400 [filter:drop-shadow(0_4px_3px_rgba(0,0,0,0.25))]">
          <div className="flex space-x-3 w-full h-full items-start md:mt-[-40px]">
            <img
              src={
                darkMode
                  ? "./dark-mode-pokeball.png"
                  : "./light-mode-pokeball.png"
              }
              className="h-8"
              alt="Pokedex Logo"
            />
            <NavLink
              to="/"
              className="navLink text-2xl tracking-wider font-bold dark:text-white"
            >
              <span onClick={() => setIsMobileMenuOpen(false)}>Pokedex</span>
            </NavLink>
          </div>

          <div className="flex">
            <ul className="hidden md:flex space-x-5">
              {currentRoutes.map(renderNavItem)}
            </ul>

            <div
              onClick={handleHamburger}
              className="flex flex-col md:hidden space-y-1"
            >
              <div className="hamburger" />
              <div className=" hamburger" />
              <div className=" hamburger" />
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="w-full p-2 md:hidden">
            <ul className="outsideStyle bg-gray-300 dark:bg-gray-600">
              <div className="insideStyle border-gray-500 bg-gray-100 dark:bg-gray-700">
                {isLogged ? (
                  <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-sky-900/40 shadow-md ring-1 ring-sky-400/50 w-fit self-center">
                    <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <span className="font-semibold italic text-sky-600 dark:text-sky-400">
                      {userName}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <img
                      src={
                        darkMode
                          ? "./dark-mode-pokeball.png"
                          : "./light-mode-pokeball.png"
                      }
                      alt="Pokedex Logo"
                      className="w-8 h-8"
                    />
                  </div>
                )}

                <ThemeSwitch />
              </div>

              {currentRoutes.map(renderNavItem)}
            </ul>
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Header;
