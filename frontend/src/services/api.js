const API_BASE_URL = 'http://localhost:8000/api';

// API Service
export const api = {
  submitReview: async (rating, reviewText, name, email) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, reviewText, name, email })
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
  },
  
  getReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }
};