import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext"; // ✅ useAuth hook

function Navbar() {
  const { user, logout } = useAuth(); // ✅ get user + logout from context
  const location = useLocation();

  // Hide Navbar completely on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  // Hide Navbar if no user is logged in
  if (!user) {
    return null;
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <span style={styles.user}>👤 {user.name || user.email}</span>
        <Link to="/create" style={styles.link}>
          New Post
        </Link>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    background: "#282c34",
    padding: "10px 20px",
    color: "white",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  user: {
    marginRight: "10px",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Navbar;
