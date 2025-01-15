import axios from "./axios.js";

export const airplaneApi = {
  
  getAll: async () => {
    const response = await axios.get('/airplanes');
    return response.data;
  },

  create: async (airplaneData) => {
    const response = await axios.post('/airplanes', airplaneData);
    return response.data;
  },

  update: async (id, airplaneData) => {
    const response = await axios.put(`/airplanes/${id}`, airplaneData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/airplanes/${id}`);
    return response.data;
  }
}; 