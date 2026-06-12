import axios from 'axios';

// Centralized Axios instance for all API calls
const api = axios.create({
 baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Recordings API ----

// Fetch all recordings, optionally with a search query
export const getRecordings = (search = '') => {
  return api.get('/recordings', {
    params: search ? { search } : {},
  });
};

// Fetch a single recording by ID
export const getRecordingById = (id) => {
  return api.get(`/recordings/${id}`);
};

// Upload a new recording (multipart/form-data)
export const uploadRecording = (formData) => {
  return api.post('/recordings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete a recording by ID
export const deleteRecording = (id) => {
  return api.delete(`/recordings/${id}`);
};

export default api;