import axios from './axios.js';

export const reservationApi = {
  // Obtener todas las reservaciones con información poblada de vuelos y pasajeros
  getAll: async () => {
    try {
      const response = await axios.get('/reservation');
      return response.data;
    } catch (error) {
      console.error('Error al obtener reservaciones:', error.message);
      throw error;
    }
  },

  // Obtener una reservación específica por ID
  getById: async (id) => {
    try {
      const response = await axios.get(`/reservation/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la reservación:', error.message);
      throw error;
    }
  },

  // Crear una nueva reservación
  create: async (reservationData) => {
    try {
      const response = await axios.post('/reservation', reservationData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la reservación:', error.message);
      throw error;
    }
  },

  // Actualizar una reservación existente
  update: async (id, reservationData) => {
    try {
      const response = await axios.put(`/reservation/${id}`, reservationData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la reservación:', error.message);
      throw error;
    }
  },

  // Eliminar una reservación
  delete: async (id) => {
    try {
      const response = await axios.delete(`/reservation/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la reservación:', error.message);
      throw error;
    }
  },

  // Buscar reservaciones por query
  search: async (query) => {
    try {
      const response = await axios.get(`/reservation/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar reservaciones:', error.message);
      throw error;
    }
  },

  // Descargar reserva
  download: async (id) => {
    try {
      const response = await axios.get(`/reservation/${id}/pdf`, {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al descargar la reserva:', error.message);
      throw error;
    }
  }
};