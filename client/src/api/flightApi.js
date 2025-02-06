import axios from "./axios.js"; // Importamos la instancia de Axios

export const flightApi = {
  // Obtener todos los vuelos
  getFlights: async () => {
    const response = await axios.get(`/flight`);
    return response.data;
  },

  // Obtener un vuelo por ID
  getFlightById: async (id) => {
    const response = await axios.get(`/flight/${id}`);
    return response.data;
  },

  // Crear un nuevo vuelo
  createFlight: async (flightData) => {
    const response = await axios.post(`/flight`, flightData);
    return response.data;
  },

  // Actualizar un vuelo por ID
  updateFlight: async (id, flightData) => {
    const response = await axios.put(`/flight/${id}`, flightData);
    return response.data;
  },

  // Eliminar un vuelo por ID
  deleteFlight: async (id) => {
    const response = await axios.delete(`/flight/${id}`);
    return response.data;
  },

  // Buscar vuelos por número de vuelo o estado
  searchFlights: async (filters) => {
    const response = await axios.get(`/flight/?`);
    return response.data;
  },
};
