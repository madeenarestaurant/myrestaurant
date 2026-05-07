import axiosInstance from './axiosInstance';

const api = {
    auth: {
        login: (credentials) => axiosInstance.post('/admin/login', credentials),
        register: (data) => axiosInstance.post('/admin/register', data),
        getProfile: () => axiosInstance.get('/admin/profile'),
        updateProfile: (data, isFormData = false) => {
            const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
            return axiosInstance.put('/admin/profile', data, config);
        },
        sendOTP: (data) => axiosInstance.post('/admin/send-otp', data),
        resetPassword: (data) => axiosInstance.post('/admin/reset-password', data),
        logout: () => axiosInstance.post('/admin/logout'),
    },

    stats: {
        getOverview: () => axiosInstance.get('/visitors/stats'),
    },

    products: {
        getAll: () => axiosInstance.get('/products'),
        create: (data) => axiosInstance.post('/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        update: (id, data) => axiosInstance.put(`/products/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        delete: (id) => axiosInstance.delete(`/products/${id}`),
    },

    categories: {
        getAll: () => axiosInstance.get('/categories'),
        create: (data) => axiosInstance.post('/categories', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        update: (id, data) => axiosInstance.put(`/categories/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        delete: (id) => axiosInstance.delete(`/categories/${id}`),
    },

    orders: {
        getAll: () => axiosInstance.get('/orders'),
        updateStatus: (id, statusData) => axiosInstance.put(`/orders/${id}`, statusData),
        delete: (id) => axiosInstance.delete(`/orders/${id}`),
    },

    reservations: {
        getAll: () => axiosInstance.get('/reservations'),
        update: (id, data) => axiosInstance.put(`/reservations/${id}`, data),
        delete: (id) => axiosInstance.delete(`/reservations/${id}`),
    },

    notifications: {
        getAll: () => axiosInstance.get('/notifications'),
        delete: (id) => axiosInstance.delete(`/notifications/${id}`),
        clearAll: () => axiosInstance.delete('/notifications'),
    },

    visitors: {
        getAll: () => axiosInstance.get('/visitors'),
    }
};

export default api;
