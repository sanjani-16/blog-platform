import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PostCard from "../components/PostCard";
import "./Profile.css";
import UserName from "../components/UserName"; // ✅

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const res = await axios.get("/users/me");
      setProfile(res.data);
      setBio(res.data.bio || "");
      setName(res.data.name || "");
    }
    async function fetchPosts() {
      const res = await axios.get("/users/me/posts");
      setPosts(res.data);
    }
    fetchProfile();
    fetchPosts();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setShowCropper(true);
    }
  };

  const handleCrop = () => {
    // Replace with real cropper output
    setCroppedAvatar(avatarFile);
    setShowCropper(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await axios.put("/users/me", { name, bio });
    window.location.reload();
  };

  const handleSaveAvatar = async () => {
    if (!croppedAvatar) return;
    const formData = new FormData();
    formData.append("avatar", croppedAvatar);
    await axios.put("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setShowCropper(false);
    window.location.reload();
  };

  if (!profile) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrap">
          <img
            src={
              profile.avatar_url ||
              "https://via.placeholder.com/120?text=Avatar"
            }
            alt="Profile"
            className="profile-avatar"
          />
        </div>

        <div className="profile-header-details">
          {/* ✅ Use clickable styled username */}
          <UserName username={profile.username} />

          <h2 className="profile-name">{name}</h2>
          <p className="profile-bio">
            {bio || <span className="profile-bio-empty">No bio yet.</span>}
          </p>

          <form className="profile-header-form" onSubmit={handleSaveProfile}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="profile-name-input"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Add your bio..."
              className="profile-bio-input"
            />
            <button type="submit" className="profile-save-btn">
              Save Profile
            </button>
          </form>

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="profile-avatar-input"
          />
        </div>
      </div>
      <hr className="profile-divider" />

      {/* Cropper Modal */}
      {showCropper && avatarFile && (
        <div className="cropper-modal-overlay">
          <div className="cropper-modal-content">
            {/* Replace below with your cropper component */}
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : null}
              alt="To crop"
              style={{ maxWidth: "300px", borderRadius: "12px" }}
            />
            <div className="cropper-actions">
              <button
                type="button"
                className="profile-save-btn"
                onClick={handleCrop}
              >
                Crop
              </button>
              <button
                type="button"
                className="profile-save-btn"
                onClick={handleSaveAvatar}
              >
                Save Avatar
              </button>
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={() => setShowCropper(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className={`profile-posts ${showCropper ? "blurred" : ""}`}>
        <h3>Your Posts</h3>
        <div className="profile-post-list">
          {posts.length === 0 ? (
            <div className="profile-post-empty">No posts yet.</div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
