import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { act } from 'react';
import axios from 'axios';
import Events from '../Events';

jest.mock('axios');

describe('Events Component', () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Event 1',
      description: 'Description 1',
      date: '2024-10-01T12:00:00Z',
      category: 'Category 1',
    },
    {
      id: 2,
      title: 'Event 2',
      description: 'Description 2',
      date: '2024-10-02T12:00:00Z',
      category: 'Category 2',
    },
  ];

  beforeEach(() => {

    axios.get.mockResolvedValue({
      data: {
        data: mockEvents,
        totalPages: 1,
        page: 1,
        limit: 5,
      },
    });

    
  }

)

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('renders the events list', async () => {
    await act( async () => render(<Events />))

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });

  test('displays "No events available" when there is no data', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: [], 
      },
    });

    await act( async () => render(<Events />))

    await waitFor(() => {
      expect(screen.getByText('No events available.')).toBeInTheDocument();
    });
  });

  test('displays an error message when the API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await act( async () => render(<Events />))

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch events.')).toBeInTheDocument();
    });
  });


  test('displays pagination buttons and handles next/previous', async () => {
    await act( async () => render(<Events />))

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
    });

    const nextButton = screen.getByText(/Next/i);
    const previousButton = screen.getByText(/Previous/i);

    expect(previousButton).toBeDisabled();

    expect(nextButton).toBeDisabled();
  });

  test('handles search functionality', async () => {
    await act( async () => render(<Events />))

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Event 1' },
    });

    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });
});

