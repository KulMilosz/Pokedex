import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { PokemonProvider } from "./context/PokemonContext";

import Header from "./components/Header";
import {
  Login,
  Register,
  Arena,
  Edit,
  Favorites,
  Home,
  Ranking,
  PokemonDetails,
} from "./components/subpages";
import { LoginProvider } from "./context/LoginContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useLoginContext } from "./hooks/useLoginContext";
import NotFound from "./components/shared/NotFound";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <LoginProvider>
          <ThemeProvider>
            <PokemonProvider>
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Header />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<LoginRouteGuard />} />
                  <Route path="register" element={<RegisterRouteGuard />} />
                  <Route path="/:id" element={<PokemonDetails />} />{" "}
                  <Route
                    path="favorites"
                    element={
                      <ProtectedRouteGuard>
                        <Favorites />
                      </ProtectedRouteGuard>
                    }
                  />
                  <Route
                    path="arena"
                    element={
                      <ProtectedRouteGuard>
                        <Arena />
                      </ProtectedRouteGuard>
                    }
                  />
                  <Route
                    path="ranking"
                    element={
                      <ProtectedRouteGuard>
                        <Ranking />
                      </ProtectedRouteGuard>
                    }
                  />
                  <Route
                    path="edit"
                    element={
                      <ProtectedRouteGuard>
                        <Edit />
                      </ProtectedRouteGuard>
                    }
                  />
                </Route>
              </Routes>
            </PokemonProvider>
          </ThemeProvider>
        </LoginProvider>
      </Router>
    </SnackbarProvider>
  );
}

// Ochrona dla tras wymagających zalogowania
function ProtectedRouteGuard({ children }) {
  const { isLogged } = useLoginContext();
  return isLogged ? children : <Navigate to="/login" />;
}

// Ochrona dla trasy logowania, jeśli użytkownik jest już zalogowany
function LoginRouteGuard() {
  const { isLogged } = useLoginContext();
  if (isLogged) return <Navigate to="/" replace />;
  return <Login />;
}

// Ochrona dla trasy rejestracji, jeśli użytkownik jest już zalogowany
function RegisterRouteGuard() {
  const { isLogged } = useLoginContext();
  if (isLogged) return <Navigate to="/" replace />;
  return <Register />;
}

export default App;
