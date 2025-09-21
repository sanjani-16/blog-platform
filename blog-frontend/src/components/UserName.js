// src/components/UserName.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserName.css";

export default function UserName({ username }) {
  const navigate = useNavigate();

  const goToProfile = () => {
    if (username) {
      // ✅ go to the public profile route with username
      navigate(`/u/${username}`);
    }
  };

  return (
    <div className="user-name-container" onClick={goToProfile}>
      <div className="user-name-avatar">
        <span role="img" aria-label="user">👤</span>
      </div>
      <span className="user-name-text">@{username}</span>
    </div>
  );
}
