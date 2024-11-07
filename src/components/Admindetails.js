import React, { useState, useEffect } from 'react';

const Admindetails = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edit1, setEdit] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://task-server-1-wwb5.onrender.com/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Check if pics and videos are included here
        setEvents(data.events);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  
  const handleEditClick = (event) => {
    setEdit(false);
    setSelectedEvent({
      id: event._id,
      name: event.eventName,
      location: event.location,
      date: event.date
    });
    // Initialize editedEvent with selectedEvent values for editing
    setEditedEvent({
      name: event.eventName,
      location: event.location,
      date: event.date,
      photos: null,
      videos: null
    });
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    const formData = new FormData();
    formData.append('location', editedEvent.location || selectedEvent.location);
    formData.append('eventName', editedEvent.name || selectedEvent.name);
    formData.append('date', editedEvent.date || selectedEvent.date);

    if (editedEvent.photos) {
      Array.from(editedEvent.photos).forEach((photo) => {
        formData.append('photos', photo);
      });
    }
    if (editedEvent.videos) {
      Array.from(editedEvent.videos).forEach((video) => {
        formData.append('videos', video);
      });
    }

    try {
      const response = await fetch(`https://task-server-1-wwb5.onrender.com/api/events/${selectedEvent.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      setEvents((prev) =>
        prev.map((event) =>
          event._id === selectedEvent.id ? { ...event, ...editedEvent } : event
        )
      );
      window.location.reload(true);
      setEdit(true); // Return to the event list view
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
  {edit1 ? (
    <div style={{marginBottom:"90px"}}>
  <div  style={{ position: 'relative',  marginTop:"45px",marginLeft:"20%" ,marginBottom:"40px"}}>
    <table  style={{ width: '150%',  borderCollapse: 'collapse',backgroundColor:"white",overflowY: 'auto', marginBottom:"30px"}} className='table-1'>
      <thead>
        <tr>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3"  }}>Name</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3"  }}>Location</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3"  }}>Date</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3"  }}>Photos</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderRight:"1px solid #cecfd3",borderBottom:"1px solid #cecfd3"  }}>Videos</th>
          <th style={{ color: "#828bb2", padding: '20px', textAlign: 'left',borderBottom:"1px solid #cecfd3" }}>Actions</th>
        </tr>
      </thead>
      <tbody style={{borderRadius:"10px"}}>
        {events.map((event) => (
          <tr key={event._id}>
            <td style={{ color: "#828bb2", padding: '10px' ,borderRight:"1px solid #cecfd3", verticalAlign: 'top', }}>{event.eventName}</td>
            <td style={{ color: "#828bb2", padding: '10px', verticalAlign: 'top', borderRight:"1px solid #cecfd3" }}>{event.location}</td>
            <td style={{ color: "#828bb2", padding: '10px', verticalAlign: 'top', borderRight:"1px solid #cecfd3" }}>{new Date(event.date).toLocaleDateString()}</td>
            <td style={{ color: "#828bb2", padding: '10px', verticalAlign: 'top', borderRight:"1px solid #cecfd3" }}>
              {/* Display images in a cell */}
              {Array.isArray(event.photos) && event.photos.length > 0 ? (
                event.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`https://task-server-1-wwb5.onrender.com/${photo}`}
                    alt={`Event Photo ${index + 1}`}
                    className="event-image"
                    
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
                <p style={{ color: "#828bb2" }}>No photos</p>
              )}
            </td>
            <td style={{ color: "#828bb2", paddingLeft: '8px' ,verticalAlign: 'top',borderRight:"1px solid #cecfd3",marginTop:"-45%"}}>
              {/* Display videos in a cell */}
              {Array.isArray(event.videos) && event.videos.length > 0 ? (
                event.videos.map((video, index) => (
                  <video
                    key={index}
                    width="180"
                    height="180"
                    controls
                    style={{ marginTop: "-27px",display: 'block' // Forces each image to start on a new line
                    }}
                  >
                    <source
                      src={`https://task-server-1-wwb5.onrender.com/${video}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ))
              ) : (
                <p style={{ color: "#828bb2" }}>No videos</p>
              )}
            </td>
            <td style={{ marginLeft:"15px", verticalAlign: 'top',padding:"10px" }}>
              <button onClick={() => handleEditClick(event)} >Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
        </div>
      ) : (
        <div>
          <div className="event-card2">
            <h1 style={{ color: "#828bb2" }}>Welcome, User!</h1>
            <p style={{ color: "#828bb2" }}>User ID: {selectedEvent?.id}</p>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <ul style={{ listStyleType: "none" }}>
              <li>
                <h3 style={{ color: "#828bb2" }}>Edit Event: {selectedEvent?.name}</h3>
                <label style={{ color: "#828bb2" }}>
                  Event Name:
                  <input
                    type="text"
                    value={editedEvent.name || ''}
                    style={{ color: "#828bb2" }}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent, name: e.target.value })
                    }
                  />
                </label>
                <label style={{ color: "#828bb2" }}>
                  Location:
                  <input
                    type="text"
                    value={editedEvent.location || ''}
                    style={{ color: "#828bb2" }}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent, location: e.target.value })
                    }
                  />
                </label>
                <label style={{ color: "#828bb2" }}>
                  Date:
                  <input
                    type="date"
                    value={editedEvent.date ? new Date(editedEvent.date).toISOString().split('T')[0] : ''}
                    style={{ color: "#828bb2" }}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent, date: e.target.value })
                    }
                  />
                </label>
                <label style={{ color: "#828bb2" }}>
                  Videos:
                  <input type="file" multiple onChange={(e) =>
                    setEditedEvent({ ...editedEvent, videos: e.target.files })
                  }/>
                </label>
                <label style={{ color: "#828bb2" }}>
                  Photos:
                  <input type="file" multiple onChange={(e) =>
                    setEditedEvent({ ...editedEvent, photos: e.target.files })
                  }/>
                </label>
                <button onClick={handleUpdateEvent}>Save Changes</button>
                <button onClick={() => setEdit(true)} style={{ marginLeft: "10px" }}>Cancel</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Admindetails;
