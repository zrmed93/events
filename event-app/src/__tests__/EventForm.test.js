import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react'
import axios from 'axios';
import EventForm from '../EventForm';

jest.mock('axios');

describe('EventForm Component', () => {
  const mockOnEventCreated = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async() => {
   await act( async () => render(<EventForm onEventCreated={mockOnEventCreated} />));

  });


  test('displays validation error if title or date is empty', async () => {
    
    fireEvent.submit(screen.getByRole('button', { name: /Add Event/i }));

    expect(screen.getByText('Title is required')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Test Event' } });
    fireEvent.submit(screen.getByRole('button', { name: /Add Event/i }));
  
    expect(screen.getByText('Date is required')).toBeInTheDocument();
  
  });

  test('submits the form successfully', async () => {
    axios.post.mockResolvedValueOnce({});


    fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByTitle(/Date/i), { target: { value: '2024-10-25' } });
    fireEvent.change(screen.getByPlaceholderText(/Category/i), { target: { value: 'Test Category' } });

    fireEvent.submit(screen.getByRole('button', { name: /Add Event/i }));

      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/events', {
        title: 'Test Event',
        description: 'Test Description',
        date: '2024-10-25',
        category: 'Test Category',
      
    });

    await waitFor(() => {
        expect(screen.getByPlaceholderText(/Title/i).value).toBe('');
        expect(mockOnEventCreated).toHaveBeenCalled();
      });
  });

  test('displays error message on failed submission', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));


    fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByTitle(/Date/i), { target: { value: '2024-10-25' } });
    fireEvent.change(screen.getByPlaceholderText(/Category/i), { target: { value: 'Test Category' } });

    fireEvent.submit(screen.getByRole('button', { name: /Add Event/i }));


    expect(mockOnEventCreated).not.toHaveBeenCalled();
  });
});
