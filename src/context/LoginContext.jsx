/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { useSnackbar } from "notistack";

export const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
  const storedIsLogged = localStorage.getItem("isLogged") === "true";
  const storedUserName = localStorage.getItem("userName") || "";
  const { enqueueSnackbar } = useSnackbar();

  const [isLogged, setIsLogged] = useState(storedIsLogged);
  const [userName, setUserName] = useState(storedUserName);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const login = (name) => {
    setIsLogged(true);
    setUserName(name);
    localStorage.setItem("isLogged", "true");
    localStorage.setItem("userName", name);
    setIsMobileMenuOpen(false);
  };

  const logout = () => {
    setIsLogged(false);
    setUserName("");
    localStorage.setItem("isLogged", "false");
    localStorage.removeItem("userName");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    enqueueSnackbar(`Wylogowano! Użytkownik: ${userName}`, {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  useEffect(() => {
    localStorage.setItem("isLogged", isLogged ? "true" : "false");
    localStorage.setItem("userName", userName);
  }, [isLogged, userName]);

  return (
    <LoginContext.Provider
      value={{
        isLogged,
        login,
        logout,
        userName,
        setIsMobileMenuOpen,
        isMobileMenuOpen,
        handleLogout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
