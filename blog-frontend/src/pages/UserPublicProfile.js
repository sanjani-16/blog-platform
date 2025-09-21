// src/pages/UserPublicProfile.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

export default function UserPublicProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await axios.get(`/users/u/${username}`);
        setUser(userRes.data);

        const postsRes = await axios.get(`/users/u/${username}/posts`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [username]);

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>{user.bio}</p>
      <img src={user.profile_picture} alt={user.username} />
      <h3>Posts</h3>
      {posts.map(p => (
        <div key={p.id}>
          <img src={p.image_url} alt={p.caption} />
          <p>{p.caption}</p>
        </div>
      ))}
    </div>
  );
}
