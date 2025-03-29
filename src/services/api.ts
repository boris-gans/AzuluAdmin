import axios from 'axios';
import { 
  Event, 
  EventCreate, 
  EventUpdate, 
  Content, 
  ContentCreate, 
  ContentUpdate,
  CloudinarySignature 
} from '../types';

// The proxy setup isn't working properly, so let's use direct API access
const directApi = axios.create({
  baseURL: 'https://azulucrm.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
});

// Auth token handling
let adminPassword: string | null = null;

export const setAdminPassword = (password: string) => {
  adminPassword = password;
  localStorage.setItem('adminPassword', password);
};

export const getAdminPassword = (): string | null => {
  if (!adminPassword) {
    adminPassword = localStorage.getItem('adminPassword');
  }
  return adminPassword;
};

export const clearAdminPassword = () => {
  adminPassword = null;
  localStorage.removeItem('adminPassword');
};

// Add auth header to all requests
directApi.interceptors.request.use((config) => {
  const password = getAdminPassword();
  if (password && config.headers) {
    config.headers['X-Admin-Password'] = password;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors
directApi.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network Error - This might be a CORS issue:', error);
    }
    
    // Handle unauthorized responses
    if (error.response && error.response.status === 401) {
      clearAdminPassword();
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Events
  getEvents: async (skip = 0, limit = 100, upcoming = false): Promise<Event[]> => {
    try {
      const { data } = await directApi.get('/events', { 
        params: { skip, limit, upcoming } 
      });
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  getEvent: async (id: number): Promise<Event> => {
    try {
      const { data } = await directApi.get(`/events/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  createEvent: async (event: EventCreate): Promise<Event> => {
    try {
      const { data } = await directApi.post('/events', event);
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  updateEvent: async (id: number, event: EventUpdate): Promise<Event> => {
    try {
      const { data } = await directApi.put(`/events/${id}`, event);
      return data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  },

  deleteEvent: async (id: number): Promise<void> => {
    try {
      await directApi.delete(`/events/${id}`);
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  },

  // Content
  getContents: async (skip = 0, limit = 100): Promise<Content[]> => {
    try {
      const { data } = await directApi.get('/content', {
        params: { skip, limit }
      });
      return data;
    } catch (error) {
      console.error('Error fetching contents:', error);
      throw error;
    }
  },

  getContent: async (key: string): Promise<Content> => {
    try {
      const { data } = await directApi.get(`/content/${key}`);
      return data;
    } catch (error) {
      console.error(`Error fetching content ${key}:`, error);
      throw error;
    }
  },

  createContent: async (content: ContentCreate): Promise<Content> => {
    try {
      const { data } = await directApi.post('/content', content);
      return data;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  },

  updateContent: async (key: string, content: ContentUpdate): Promise<Content> => {
    try {
      const { data } = await directApi.put(`/content/${key}`, content);
      return data;
    } catch (error) {
      console.error(`Error updating content ${key}:`, error);
      throw error;
    }
  },

  deleteContent: async (key: string): Promise<void> => {
    try {
      await directApi.delete(`/content/${key}`);
    } catch (error) {
      console.error(`Error deleting content ${key}:`, error);
      throw error;
    }
  },

  // Cloudinary
  getCloudinarySignature: async (): Promise<CloudinarySignature> => {
    try {
      const { data } = await directApi.get('/cloudinary/signature');
      return data;
    } catch (error) {
      console.error('Error getting Cloudinary signature:', error);
      throw error;
    }
  },

  // Auth check
  checkAuth: async (): Promise<boolean> => {
    try {
      // Try to access a protected endpoint
      await directApi.get('/cloudinary/signature');
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAdminPassword();
      return false;
    }
  }
};

export default apiService; 