import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      notifications: true,
      showDetails: true,
      toggleDarkMode: () => set((state) => {
        const newMode = !state.darkMode;
        if (newMode) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        return { darkMode: newMode };
      }),
      setNotifications: (val) => set({ notifications: val }),
      setShowDetails: (val) => set({ showDetails: val }),
      // Function to sync theme on load
      syncTheme: () => set((state) => {
        if (state.darkMode) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        return state;
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
