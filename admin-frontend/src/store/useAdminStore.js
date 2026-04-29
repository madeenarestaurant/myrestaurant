import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useAdminStore = create((set, get) => ({
  activeTab: localStorage.getItem('adminActiveTab') || 'dashboard',
  setActiveTab: (tab) => {
    localStorage.setItem('adminActiveTab', tab);
    set({ activeTab: tab });
  },
  
  stats: {
    totalOrders: 0,
    completeOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalReservations: 0,
    totalVisitors: 0,
    onlineVisitors: 0,
    topPages: []
  },

  
  products: [],
  categories: [],
  recentOrders: [],
  reservations: [],
  visitors: [],
  profile: null,
  loading: false,
  newNotification: null,

  fetchVisitors: async () => {
    try {
        const res = await axiosInstance.get('/visitors');
        set({ visitors: res.data });
    } catch (error) {
        console.error('Error fetching visitors:', error);
    }
  },

  fetchProfile: async () => {
    try {
        const res = await axiosInstance.get('/admin/profile');
        set({ profile: res.data });
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
  },

  updateProfile: async (data, isFormData = false) => {
    try {
        const res = await axiosInstance.put('/admin/profile', data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        set({ profile: res.data });
        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.response?.data?.message };
    }
  },

  fetchStats: async () => {
    set({ loading: true });
    try {
        const [prodRes, catRes, orderRes, resvRes, visitorRes] = await Promise.all([
            axiosInstance.get('/products'),
            axiosInstance.get('/categories'),
            axiosInstance.get('/orders'),
            axiosInstance.get('/reservations').catch(() => ({ data: [] })),
            axiosInstance.get('/visitors/stats').catch(() => ({ data: { totalVisitors: 0, onlineVisitors: 0, topPages: [] } }))
        ]);

        
        const orders = orderRes.data || [];
        const products = prodRes.data || [];
        const categories = catRes.data || [];
        const reservations = resvRes.data || [];

        const totalOrders = orders.length;
        const completeOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
        const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'requested').length;
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        set({
            stats: { 
                totalOrders, 
                completeOrders, 
                cancelledOrders, 
                pendingOrders, 
                totalRevenue,
                totalProducts: products.length,
                totalCategories: categories.length,
                totalReservations: reservations.length,
                totalVisitors: visitorRes.data.totalVisitors,
                onlineVisitors: visitorRes.data.onlineVisitors,
                topPages: visitorRes.data.topPages
            },

            products,
            categories,
            recentOrders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
            reservations
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
    } finally {
        set({ loading: false });
    }
  },

  fetchOrders: async () => {
    try {
        const res = await axiosInstance.get('/orders');
        set({ recentOrders: res.data });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
  },

  updateOrderStatus: async (id, data) => {
    try {
        await axiosInstance.put(`/orders/${id}`, data);
        get().fetchStats(); // Refresh everything
    } catch (error) {
        console.error('Error updating order status:', error);
    }
  },

  deleteProduct: async (id) => {
    try {
        await axiosInstance.delete(`/products/${id}`);
        get().fetchStats();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
  },

  updateProduct: async (id, data) => {
    try {
        await axiosInstance.put(`/products/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        get().fetchStats();
        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.response?.data?.message };
    }
  },

  createProduct: async (data) => {
    try {
        await axiosInstance.post('/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        get().fetchStats();
        return { success: true };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: error.response?.data?.message };
    }
  },

  deleteCategory: async (id) => {
    try {
        await axiosInstance.delete(`/categories/${id}`);
        get().fetchStats();
    } catch (error) {
        console.error('Error deleting category:', error);
    }
  },

  updateCategory: async (id, data) => {
    try {
        await axiosInstance.put(`/categories/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        get().fetchStats();
        return { success: true };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: error.response?.data?.message };
    }
  },

  createCategory: async (data) => {
    try {
        await axiosInstance.post('/categories', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        get().fetchStats();
        return { success: true };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: error.response?.data?.message };
    }
  },

  initSocket: (socket) => {
    if (!socket) return;

    socket.on('new_order', (order) => {
        set((state) => ({
            recentOrders: [order, ...state.recentOrders].slice(0, 10),
            stats: { 
                ...state.stats, 
                totalOrders: state.stats.totalOrders + 1,
                pendingOrders: state.stats.pendingOrders + 1
            }
        }));
        // Optional: show notification
        console.log('New Order Received:', order);
    });

    socket.on('new_reservation', (reservation) => {
        set((state) => ({
            reservations: [reservation, ...state.reservations],
            stats: { 
                ...state.stats, 
                totalReservations: state.stats.totalReservations + 1
            }
        }));
        console.log('New Reservation Received:', reservation);
    });

    socket.on('new_notification', (notification) => {
        set({ newNotification: notification });
        setTimeout(() => set({ newNotification: null }), 10000);
    });

    socket.on('online_count', (count) => {
        set((state) => ({
            stats: { ...state.stats, onlineVisitors: count }
        }));
    });
  }

}));


export default useAdminStore;
