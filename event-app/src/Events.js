// src/EventApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './EventForm';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setfetchError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); 
  const [totalPages, setTotalPages] = useState(1); 


  useEffect(() => {
    console.log('fetch')
    fetchEvents();
  }, [page,limit]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events',{        params: { page, limit },
      })
      setEvents(response.data.data)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log('Error fetching events:', error)
      setfetchError('Failed to fetch events.')
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };



  const handleEventCreated = async () => {
        fetchEvents()
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Event Manager</h1>
      <EventForm onEventCreated={handleEventCreated} />

{  !!events.length &&    <input
        type="text"
        placeholder="Search by title or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
}


{fetchError?   <div>{fetchError}</div>  :filteredEvents.length>0? <table style={{width:"100%",  borderCollapse: "collapse"
}} >
    <tbody>
    <tr>
    <th>Title</th>
    <th>Description</th>
    <th>Date</th>
    <th>Category</th>
    </tr>
        {filteredEvents.map((event) => (
          <tr key={event.id}>
            <td><h3>{event.title}</h3></td> 
           <td><p>{event.description}</p> </td> 
          <td>  <p> {new Date(event.date).toLocaleString()}</p></td> 
           <td> <p> {event.category}</p></td> 
          </tr>
        ))     
}</tbody>
      </table>: <div>No events available</div>  }
{!searchTerm &&  !!events.length&&  <div>
    <div>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
      <div>
  <label htmlFor="limit">Events per page: </label>
  <select id="limit" value={limit} onChange={(e) => setLimit(e.target.value)}>
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="20">20</option>
  </select>
</div>
</div>
}
    </div>
  );
};

export default Events;
