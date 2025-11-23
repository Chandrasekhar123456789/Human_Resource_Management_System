// frontend/src/services/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'; // fallback for local dev
const instance = axios.create({ baseURL: `${BASE.replace(/\\/$/, '')}/api` });

let token = null;
export default {
  setToken(t) { token = t; },
  async post(url, data) { 
    return (await instance.post(url, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} })).data;
  },
  async get(url) { 
    return (await instance.get(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })).data;
  },
  async put(url, data) { 
    return (await instance.put(url, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} })).data;
  },
  async del(url) { 
    return (await instance.delete(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })).data;
  }
};

