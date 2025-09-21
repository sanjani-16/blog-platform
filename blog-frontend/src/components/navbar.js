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
        <Link to="/profile" style={styles.user}>
          👤 {user.name || user.email}
        </Link>
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
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    zIndex: 100,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    background: "#282c34",
    padding: "10px 20px",
    color: "white",
    boxShadow: "0 2px 12px rgba(99,102,241,0.12)",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginRight: "24px",
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
