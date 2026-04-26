import axios from 'axios';
import { io } from 'socket.io-client';
import { UAParser } from 'ua-parser-js';
import Cookies from 'js-cookie';

const API_URL = 'https://madeena-api.madeenarestaurant.com/api/visitors';
const SOCKET_URL = 'https://madeena-api.madeenarestaurant.com';

class TrackingService {
  constructor() {
    this.visitorId = this.getVisitorId();
    this.socket = null;
    this.startTime = Date.now();
    this.currentPath = window.location.pathname;
  }

  getVisitorId() {
    let id = Cookies.get('visitorId');
    if (!id) {
      id = 'v-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
      Cookies.set('visitorId', id, { expires: 365 });
    }
    return id;
  }


  init() {
    this.trackPageVisit();
    this.initSocket();
    this.initClickTracking();
    this.initUnloadTracking();
  }

  initSocket() {
    this.socket = io(SOCKET_URL);
    this.socket.emit('visitor_connected', this.visitorId);
  }

  async trackPageVisit() {
    try {
      const parser = new UAParser();
      const userAgent = navigator.userAgent;

      await axios.post(`${API_URL}/track`, {
        visitorId: this.visitorId,
        path: window.location.pathname,
        userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`
      });
    } catch (error) {
      console.error('Tracking failed:', error);
    }
  }

  initClickTracking() {
    document.addEventListener('click', async (e) => {
      try {
        const x = e.pageX;
        const y = e.pageY;
        const element = e.target.tagName + (e.target.id ? `#${e.target.id}` : '') + (e.target.className ? `.${e.target.className.split(' ')[0]}` : '');

        await axios.post(`${API_URL}/click`, {
          visitorId: this.visitorId,
          path: window.location.pathname,
          x,
          y,
          element
        });
      } catch (error) {
        // Silent error for tracking
      }
    });
  }

  initUnloadTracking() {
    window.addEventListener('beforeunload', () => {
      this.sendTimeSpent();
    });

    // Also track on path change (for SPA)
    let lastUrl = window.location.href;
    new MutationObserver(() => {
      const url = window.location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.sendTimeSpent();
        this.startTime = Date.now();
        this.currentPath = window.location.pathname;
        this.trackPageVisit();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  async sendTimeSpent() {
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    if (timeSpent > 0) {
      try {
        // Use beacon API if available for more reliable delivery on unload
        const data = JSON.stringify({
          visitorId: this.visitorId,
          path: this.currentPath,
          timeSpent
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon(`${API_URL}/time`, data);
        } else {
          await axios.post(`${API_URL}/time`, {
            visitorId: this.visitorId,
            path: this.currentPath,
            timeSpent
          });
        }
      } catch (error) {
        // Silent error
      }
    }
  }
}

export default new TrackingService();
