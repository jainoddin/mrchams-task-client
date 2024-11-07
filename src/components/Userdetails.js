import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Userdetails() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});
  const [user, setUser] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchUserEvents = async () => {
        try {
          const response = await fetch(`https://task-server-1-wwb5.onrender.com/api/events/user/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          const data = await response.json();
          setEvents(data.events);

          const initialEditedEvent = data.events.reduce((acc, event) => {
            acc[event._id] = { 
              location: event.location,
              eventName: event.eventName,
              date: event.date ? new Date(event.date).toISOString().split('T')[0] : '', // Ensure a valid date format
              photos: [],
              videos: []
            };
            return acc;
          }, {});
          setEditedEvent(initialEditedEvent);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchUserEvents();
    }
  }, [userId]);

  const handleInputChange = (eventId, field, value) => {
    setEditedEvent((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: field === 'date' ? value : value,  // Use the date string directly from the input
      },
    }));
  };

  const handleFileChange = (eventId, field, event) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      setEditedEvent((prev) => ({
        ...prev,
        [eventId]: {
          ...prev[eventId],
          [field]: files,
        },
      }));
    }
  };

  const handleUpdateEvent = async (eventId) => {
    const eventDetails = editedEvent[eventId];
    if (!eventDetails || !userId) {
      return alert('Event details or user ID is missing.');
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('location', eventDetails.location);
    formData.append('eventName', eventDetails.eventName);
    formData.append('date', eventDetails.date);

    if (eventDetails.photos) {
      Array.from(eventDetails.photos).forEach((photo) => {
        formData.append('photos', photo);
      });
    }
    if (eventDetails.videos) {
      Array.from(eventDetails.videos).forEach((video) => {
        formData.append('videos', video);
      });
    }

    try {
      const response = await fetch(`https://task-server-1-wwb5.onrender.com/api/events/${eventId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? { ...event, ...eventDetails } : event
        )
      );
      alert('Event updated successfully for this user!');
      window.location.reload(true);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
     {user ? (
  <div >
    <table style={{ width: '100%',  borderCollapse: 'collapse',backgroundColor:"white",marginLeft:"35%",marginTop:"13%" }} className='table-1'>
      <thead>
        <tr>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3" }}>Name</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3" }}>Location</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3" }}>Date</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3" }}>Photos</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3" }}>Videos</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderBottom:"1px solid #cecfd3" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event._id} >
            <td style={{ color: "#828bb2", padding: '10px' ,borderRight:"1px solid #cecfd3", verticalAlign: 'top', }}>{event.eventName}</td>
            <td style={{ color: "#828bb2", padding: '10px', verticalAlign: 'top', borderRight:"1px solid #cecfd3" }}>{event.location}</td>
            <td style={{ color: "#828bb2", padding: '10px', verticalAlign: 'top',borderRight:"1px solid #cecfd3"  }}>{new Date(event.date).toLocaleDateString()}</td>
            
            <td style={{ color: "#828bb2", padding: '10px' , verticalAlign: 'top',borderRight:"1px solid #cecfd3" }}>
  {event.photos.length > 0 ? (
    event.photos.map((photo, index) => (
      <img
        key={index}
        src={`https://task-server-1-wwb5.onrender.com/${photo}`}
        alt={`Event Photo ${index + 1}`}
        style={{
          width: '150px',
          height: '150px',
          margin: '5px',
          verticalAlign: 'top', 
          display: 'block' // Forces each image to start on a new line
        }}
      />
    ))
  ) : (
    <p>No photos available.</p>
  )}
</td>

            
            <td style={{ color: "#828bb2", padding: '5px' ,verticalAlign: 'top',borderRight:"1px solid #cecfd3"}}>
              {event.videos.length > 0 ? (
                event.videos.map((video, index) => (
                  <div key={index}  style={{  marginTop:"-32px"  }}>
                    <video width="180" height="180" controls>
                      <source src={`https://task-server-1-wwb5.onrender.com/${video}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))
              ) : (
                <p>No videos available.</p>
              )}
            </td>
            
            <td style={{ padding: '10px',verticalAlign: 'top',  }}>
              <button
                style={{
                  display: 'flex',
                  width: '60px',
                  height: '30px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#828bb2',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setUser(false)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      ) : (
        <div className="event-card2">
          <h1 style={{ color: "#828bb2" }}>Welcome, User!</h1>
          <p style={{ color: "#828bb2" }}>User ID: {userId}</p>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {events.length > 0 ? (
            <ul style={{ listStyleType: "none" }}>
              {events.map((event) => (
                <li key={event._id}>
                  <h3 style={{ color: "#828bb2" }}>Edit Event: {event.eventName}</h3>
                  <label style={{ color: "#828bb2" }}>
                    Event Name:
                    <input
                      type="text"
                      value={editedEvent[event._id]?.eventName || event.eventName}
                      onChange={(e) => handleInputChange(event._id, 'eventName', e.target.value)}
                      style={{ color: "#828bb2" }}
                    />
                  </label>
                  <label style={{ color: "#828bb2" }}>
                    Location:
                    <input
                      type="text"
                      value={editedEvent[event._id]?.location || event.location}
                      onChange={(e) => handleInputChange(event._id, 'location', e.target.value)}
                      style={{ color: "#828bb2" }}
                    />
                  </label>
                  <label style={{ color: "#828bb2" }}>
                    Date:
                    <input
                      type="date"
                      value={editedEvent[event._id]?.date || event.date}
                      onChange={(e) => handleInputChange(event._id, 'date', e.target.value)}
                      style={{ color: "#828bb2" }}
                    />
                  </label>
                  <label style={{ color: "#828bb2" }}>
                    Videos:
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(event._id, 'videos', e)}
                      multiple
                    />
                  </label>
                  <label style={{ color: "#828bb2" }}>
                    Photos:
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(event._id, 'photos', e)}
                      multiple
                    />
                  </label>
                  <button onClick={() => handleUpdateEvent(event._id)}>Save Changes</button>
                  <button onClick={() => setUser(true)} style={{ marginLeft: "6px" }}>Cancel</button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#828bb2" }}>No events found for this user.</p>
          )}
        </div>
      )}
    </>
  );
}

export default Userdetails;
