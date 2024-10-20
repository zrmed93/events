const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let events = [];

const validateEvent = (req, res, next) => {
    const { title, description, date, category } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required.' });
    }
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }
    next();
  };
  

app.get('/events', (req, res) => {
    const { page = 1, limit = 5 } = req.query; 
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const paginatedEvents = events.slice(startIndex, endIndex);
  
    res.json({
        total: events.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(events.length / limit), 
        data: paginatedEvents, 
    
    });
  });

app.get('/events/:id', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json(event);
  });
  app.post('/events', validateEvent, (req, res) => {
    const { title, description, date, category } = req.body;
    const newEvent = {
      id: uuidv4(),
      title,
      description,
      date,
      category
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
  });
  
  app.put('/events/:id', validateEvent, (req, res) => {
    const { title, description, date, category } = req.body;
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found.' });
    }
  
    events[eventIndex] = {
      ...events[eventIndex],
      title,
      description,
      date,
      category
    };
    res.json(events[eventIndex]);
  });
  
  
  
  app.delete('/events/:id', (req, res) => {
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    
    events.splice(eventIndex, 1);
    res.status(204).send(); 
  });

module.exports = {app,validateEvent}