const request = require('supertest');
const {app} = require('./app');

let eventId
it('GET /events should return an empty array initially', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toEqual([]);
  });


  it('POST /events should create a new event', async () => {
    const newEvent = {
      title: 'Test Event',
      description: 'This is a test event',
      date: '2024-11-12T19:00:00Z',
      category: 'Music'
    };
    const res = await request(app).post('/events').send(newEvent);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newEvent.title);
    eventId = res.body.id
  });
  it('GET /events/:id should return a specific event', async () => {
    console.log({eventId})

    const res = await request(app).get(`/events/${eventId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toBe(eventId);
  });


  it('PUT /events/:id should update an event', async () => {

    const updatedEvent = {
      title: 'Updated Event',
      description: 'This event has been updated',
      date: '2024-12-12T19:00:00Z',
      category: 'Updated Category'
    };
    const res = await request(app).put(`/events/${eventId}`).send(updatedEvent);
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe(updatedEvent.title);
    expect(res.body.description).toBe(updatedEvent.description);
  });

  it('DELETE /events/:id should delete an event', async () => {

    const res = await request(app).delete(`/events/${eventId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('Validation should reject missing title or date', async () => {
    const invalidEvent = {
      description: 'This event has no title or date',
      category: 'Invalid'
    };
    const res = await request(app).post('/events').send(invalidEvent);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Title and date are required.');
  });

  it('Validation should reject invalid date format', async () => {
    const invalidEvent = {
      title: 'Invalid Date Event',
      description: 'This event has an invalid date format',
      date: 'invalid-date',
      category: 'Invalid'
    };
    const res = await request(app).post('/events').send(invalidEvent);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid date format.');
  });
