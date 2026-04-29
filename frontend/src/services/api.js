import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080/api',
  baseURL: 'https://madeena-api.madeenarestaurant.com/api',
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

let imageCache = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const menuImageApi = {
  getCache: () => imageCache,
  getAll: async () => {
    if (imageCache && (Date.now() - cacheTime < CACHE_TTL)) {
      return { data: imageCache };
    }
    const response = await api.get('/menu-images');
    imageCache = response.data;
    cacheTime = Date.now();
    return response;
  }
};


export default api;
