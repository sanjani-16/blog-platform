import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import CreatePost from "./pages/createpost";
import { useAuth } from "./context/authcontext";

// ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      {/* Show navbar only if logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Redirect root based on login */}
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/home" />}
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
