import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";

export const useLoginContext = () => {
  const context = useContext(LoginContext);

  return context;
};
