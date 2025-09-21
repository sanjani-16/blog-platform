// src/pages/AuthorProfile.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./AuthorProfile.css";

export default function AuthorProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await axios.get("/users/me");
        setUser(userRes.data);

        const postsRes = await axios.get("/users/me/posts");
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  if (!user) return <p>Loading profile…</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          className="profile-avatar"
          src={user.profile_picture || "/default-avatar.png"}
          alt={user.username}
        />
        <div className="profile-info">
          <h2>Username: @{user.username}</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <button className="edit-btn">Edit Profile</button>
        </div>
      </div>

      <h3>Your Posts</h3>
      <div className="posts-grid">
        {posts.length === 0 && <p>No posts yet.</p>}
        {posts.map((p) => (
          <div key={p.id} className="post-card">
            {p.image_url && (
              <img src={p.image_url} alt={p.caption} className="post-img" />
            )}
            <p>{p.caption}</p>
            <span className="post-date">
              {new Date(p.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
