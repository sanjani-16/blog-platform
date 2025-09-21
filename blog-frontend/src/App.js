// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import CreatePost from "./pages/createpost";
import AuthorProfile from "./pages/AuthorProfile";
import { useAuth } from "./context/authcontext";
import Header from "./components/Header";
import UserPublicProfile from "./pages/UserPublicProfile";

// ✅ Wrapper component for protected routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      {/* Single header shown everywhere */}
      <Header currentUser={user} />

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

        {/* Logged-in user’s own profile (with edit option) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AuthorProfile />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public user profile by username (no auth required) */}
        {/* /u/:username MUST match useParams() in UserPublicProfile.js */}
        <Route path="/u/:username" element={<UserPublicProfile />} />

        {/* Catch-all: redirect any unknown URL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
