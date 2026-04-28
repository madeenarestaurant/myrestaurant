import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // baseURL: 'https://madeena-api.madeenarestaurant.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reservation specific API calls
export const reservationApi = {
  sendOtp: (email) => api.post('/reservations/send-otp', { email }),
  verifyOtp: (email, otp, visitorId) => api.post('/reservations/verify-otp', { email, otp, visitorId }),

  book: (data) => api.post('/reservations/book', data),
  getOccupiedSlots: (date) => api.get(`/reservations/occupied-slots/${date}`),
};

export const productApi = {
  getAll: () => api.get('/products'),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
};

export const orderApi = {
  create: (data) => api.post('/orders', data),
};


export default api;
