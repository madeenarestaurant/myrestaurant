import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  // baseURL: 'https://madeenaapi.adwaithh.online/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reservation specific API calls
export const reservationApi = {
  sendOtp: (email) => api.post('/reservations/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/reservations/verify-otp', { email, otp }),
  book: (data) => api.post('/reservations/book', data),
  getOccupiedSlots: (date) => api.get(`/reservations/occupied-slots/${date}`),
};

export default api;
