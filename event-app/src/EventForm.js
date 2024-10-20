import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventForm = ({onEventCreated}) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
  });
  const [errors, setErrors] = useState({});



  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const validationErrors = {};
    if (!newEvent.title) validationErrors.title = 'Title is required';
    if (!newEvent.date) validationErrors.date = 'Date is required';
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post('http://localhost:5000/events', newEvent);
        onEventCreated(); 
        setNewEvent({ title: '', description: '', date: '', category: '' }); 
      } catch (error) {
        console.log('Error creating event:', error);
      }
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newEvent.title}
          onChange={handleChange}
        />
        {errors.title && <p>{errors.title}</p>}
        
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleChange}
        />
        
        <input
        title='Date'
          type="date"
          name="date"
          value={newEvent.date}
          onChange={handleChange}
        />
        {errors.date && <p>{errors.date}</p>}
        
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newEvent.category}
          onChange={handleChange}
        />
        
        <button type="submit">Add Event</button>
      </form>



    </div>
  );
};

export default EventForm;
