import axios from "./axios.js";

export const airlineApi = {
  
  getAll: async () => {
    const response = await axios.get('/airlines');
    return response.data;
  },

  create: async (airlineData) => {
    const response = await axios.post('/airlines', airlineData);
    return response.data;
  },

  update: async (id, airlineData) => {
    const response = await axios.put(`/airlines/${id}`, airlineData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/airlines/${id}`);
    return response.data;
  },

  search: async () => {
    const response = await axios.get(`/airlines/?search=${query}`);
    return response.data;
  }
};