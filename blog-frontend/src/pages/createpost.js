import React, { useState, useRef } from "react";
import axios from "axios";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [filter, setFilter] = useState("none");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [captured, setCaptured] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Stop camera stream if running
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraOpen(false);
  };

  // Open Camera
  const openCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not available on this browser.");
        return;
      }
      setCameraOpen(true);
      setCaptured(false);
      setFile(null);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera error: " + err.message);
    }
  };

  // Capture from Camera
  const captureImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.filter = filter;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const imageFile = new File([blob], "camera.jpg", { type: "image/jpeg" });
      setFile(imageFile);
      setCaptured(true);
      stopCamera(); // stop camera after capture
    }, "image/jpeg");
  };

  // Retake picture
  const retakeImage = () => {
    setCaptured(false);
    setFile(null);
    openCamera();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      stopCamera(); // stop camera if running
      setFile(selectedFile);
      setCaptured(false);
    }
  };

  // Post to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image or capture from camera.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully!");
      setFile(null);
      setCaption("");
      setCaptured(false);
      stopCamera();
    } catch (err) {
      alert("Error creating post: " + err.message);
    }
  };

  return (
    <div>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        {/* File Upload */}
        <label>Select Image from Files: </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <br />

        {/* Camera Section */}
        <label>Or Use Camera: </label>
        {!cameraOpen && !captured && (
          <button type="button" onClick={openCamera}>
            Open Camera
          </button>
        )}

        {cameraOpen && !captured && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="300"
              height="200"
              style={{ filter }}
            />
            <canvas ref={canvasRef} width="300" height="200" hidden />
            <br />
            <button type="button" onClick={captureImage}>
              Capture
            </button>
          </div>
        )}

        {/* Captured Preview */}
        {captured && file && (
          <div>
            <h4>Preview</h4>
            <img
              src={URL.createObjectURL(file)}
              alt="Captured"
              style={{ width: "300px", filter }}
            />
            <br />
            <button type="button" onClick={retakeImage}>
              ❌ Retake
            </button>
          </div>
        )}

        <br />

        {/* Horizontal Filters */}
        <label>Filters: </label>
        <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
          {[
            { name: "None", value: "none" },
            { name: "Grayscale", value: "grayscale(100%)" },
            { name: "Sepia", value: "sepia(100%)" },
            { name: "Contrast", value: "contrast(200%)" },
            { name: "Blur", value: "blur(3px)" },
          ].map((f) => (
            <button
              type="button"
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "5px 10px",
                border: filter === f.value ? "2px solid blue" : "1px solid gray",
              }}
            >
              {f.name}
            </button>
          ))}
        </div>

        <br />

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <br />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}

export default CreatePost;
