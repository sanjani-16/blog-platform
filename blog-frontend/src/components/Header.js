// src/components/Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserName from "./UserName";
import "./Header.css";

export default function Header({ currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // src/components/Header.js
const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
  navigate(`/u/${searchTerm.trim()}`)
    setSearchTerm("");
  }
};


  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo" onClick={() => navigate("/home")}>InstaLike</h1>
      </div>

      {/* Show search bar only if logged in */}
      {currentUser && (
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search username…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      )}

      <div className="header-right">
        {currentUser && (
          <>
            <UserName username={currentUser?.name || "guest"} />
            <button className="new-post-btn" onClick={() => navigate("/create")}>
              New Post
            </button>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
