import axios from "./axios.js"; // Asegúrate de que esta instancia ya está configurada

// Obtener todos los pasajeros con paginación
export const passengerApi = {
  getPassengers: async (page = 1, limit = 10) => {
    const response = await axios.get(`/passenger`);
    return response.data;
  },

  // Obtener un pasajero por ID
  getPassengerById: async (id) => {
    const response = await axios.get(`/passenger/${id}`);
    return response.data;
  },

  // Crear un nuevo pasajero
  createPassenger: async (passengerData) => {
    const response = await axios.post(`passenger()`, passengerData);
    return response.data;
  },

  // Actualizar un pasajero por ID
  updatePassenger: async (id, passengerData) => {
    const response = await axios.put(`/passenger/${id}`, passengerData);
    return response.data;
  },

  // Eliminar un pasajero por ID
  deletePassenger: async (id) => {
    const response = await axios.delete(`/passenger/${id}`);
    return response.data;
  },

  // Buscar un pasajero por nombre
  searchPassengerByName: async (name) => {
    const response = await axios.get(`/passenger/search?name=${name}`);
    return response.data;
  },
};
