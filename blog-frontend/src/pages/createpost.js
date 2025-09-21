import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; // your util to actually crop
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (croppedImage) {
        formData.append("image", croppedImage, "cropped.jpg");
      } else if (image) {
        formData.append("image", image);
      }
      await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setCropping(true);
      setCroppedImage(null);
    }
  };

  const handleCropSave = async () => {
    if (!image || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(cropped);
    setCropping(false);
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Create New Post</h2>

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's on your mind?"
        required
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {cropping && image && (
        <div className="cropper-container">
          <Cropper
            image={URL.createObjectURL(image)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div className="cropper-actions" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1.5rem', zIndex: 10 }}>
            <button
              type="button"
              onClick={handleCropSave}
              className="save-crop-btn"
            >
              Crop &amp; Save
            </button>
          </div>
        </div>
      )}

      {croppedImage && (
  <div className="cropped-preview">
    <img src={URL.createObjectURL(croppedImage)} alt="Cropped Preview" />
  </div>
)}


      <button type="submit" className="post-btn">
        Post
      </button>
    </form>
  );
}
