import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const useDarkMode = () => useContext(ThemeContext);

export default useDarkMode;
