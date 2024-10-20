const { validateEvent } = require('./app'); 
describe('validateEvent Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() when valid event is provided', () => {
    req.body = {
      title: 'Test Event',
      date: '2024-11-12T19:00:00Z',
    };

    validateEvent(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if title is missing', () => {
    req.body = { date: '2024-11-12T19:00:00Z' };

    validateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Title and date are required.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if date is missing', () => {
    req.body = { title: 'Test Event' };

    validateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Title and date are required.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if date is invalid', () => {
    req.body = {
      title: 'Test Event',
      date: 'invalid-date',
    };

    validateEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid date format.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
