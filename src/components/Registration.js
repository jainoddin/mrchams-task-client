import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Registration = () => {
  const location = useLocation();
  const userId = location.state?.userId || ''; // Get userId from location state, fallback to empty string if not available

  const [locationValue, setLocationValue] = useState('');
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();


  const handlePhotoChange = (e) => {
    setPhotos(e.target.files);
  };

  const handleVideoChange = (e) => {
    setVideos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('location', locationValue);
    formData.append('eventName', eventName);
    formData.append('date', date);
    formData.append('userId', userId); // Append userId to the form data

    // Append files to formData
    Array.from(photos).forEach((file) => formData.append('photos', file));
    Array.from(videos).forEach((file) => formData.append('videos', file));

    try {
      const response = await axios.post('https://task-server-1-wwb5.onrender.com/api/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Event created successfully:', response.data);
      navigate("/")

    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="event-card2">
      <h1 style={{ color: "#828bb2" }}>Create Event</h1>
      <label>
        Location:
        <input type="text" value={locationValue} onChange={(e) => setLocationValue(e.target.value)} />
      </label>
      <label>
        Event Name:
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      </label>
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Photos:
        <input type="file" multiple onChange={handlePhotoChange} />
      </label>
      <label>
        Videos:
        <input type="file" multiple onChange={handleVideoChange} />
      </label>
      <button onClick={handleSubmit}>Submit Event</button>
    </div>
  );
};

export default Registration;
