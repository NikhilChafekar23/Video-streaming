import React, { useState, useEffect } from 'react';
import './VideoUpload.css';

function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videos, setVideos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedVideos = JSON.parse(localStorage.getItem('videos')) || [];
    setVideos(storedVideos);
  }, []);

  const handleVideoUpload = (e) => {
    e.preventDefault();

    if (!videoFile || !videoName || !videoDescription) {
      alert('Please provide a video file, name, and description.');
      return;
    }

    // Use FileReader to create a data URL for the video
    const reader = new FileReader();
    reader.onloadend = () => {
      const newVideo = {
        name: videoName,
        description: videoDescription,
        url: reader.result, // This is the data URL of the video
      };

      let updatedVideos = [...videos];
      if (editingIndex !== null) {
        updatedVideos[editingIndex] = newVideo; // If editing, replace the video at the specified index
      } else {
        updatedVideos.push(newVideo); // Otherwise, add a new video
      }

      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      setVideos(updatedVideos);

      // Clear form and reset editing state
      setVideoFile(null);
      setVideoName('');
      setVideoDescription('');
      setEditingIndex(null); // Reset the editing state
    };

    reader.readAsDataURL(videoFile); // Read the video as a data URL
  };

  const handleEdit = (index) => {
    const videoToEdit = videos[index];
    setVideoFile(null); // File input cannot be pre-set
    setVideoName(videoToEdit.name);
    setVideoDescription(videoToEdit.description);
    setEditingIndex(index); // Set the video being edited
  };

  const handleDelete = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
    setVideos(updatedVideos);
  };

  return (
    <div>
      <form onSubmit={handleVideoUpload}>
        <input
          type="file"
          onChange={(e) => setVideoFile(e.target.files[0])}
          accept="video/*"
          disabled={editingIndex !== null} // Disable file input when editing
        />
        <input
          type="text"
          placeholder="Video Name"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
        />
        <textarea
          placeholder="Video Description"
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
        />
        <button type="submit">{editingIndex !== null ? 'Update Video' : 'Upload Video'}</button>
      </form>

      {/* Display uploaded videos */}
      {videos.length > 0 && (
        <div>
          <h3>Uploaded Videos</h3>
          <ul>
            {videos.map((video, index) => (
              <li key={index}>
                <h4>{video.name}</h4>
                <p>{video.description}</p>
                <video width="300" controls>
                  <source src={video.url} type="video/mp4" />
                </video>
                <div>
                  <button
                    style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
