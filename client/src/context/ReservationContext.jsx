import React, { createContext, useContext, useState, useEffect } from "react";
import { reservationApi } from "../api/reservationApi";

// Creamos el contexto global para el uso de la api
const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservation, setReservation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReservation = async () => {
    try {
      // setLoading(true);
      const response = await reservationApi.getAll()

      console.log("Response de la API:", response);

      setReservation(response);
    } catch (error) {
      setError("Error al cargar las reservas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData) => {
    try {
      setLoading(true);
      const response = await reservationApi.create(reservationData);
      const newReservartion =
        response.data?.reservation || response.reservation;
      setReservation((prev) => [...prev, newReservartion]);
      return newReservartion;
    } catch (error) {
      setError("Error al crear la reserva");
      throw error;
      ñ;
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    try {
      setLoading(true);
      await reservationApi.delete(id);
      setReservation((prev) =>
        prev.filter((reservation) => reservation._id !== id)
      );
    } catch (error) {
      setError("Error al eliminar aerolínea");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (id, ReservationData) => {
    try {
      setLoading(true);
      const response = await reservationApi.update(id, reservationData);
      const updatedReservation =
        response.data?.reservation || response.reservation;
      setReservation((prev) =>
        prev.map((reservation) =>
          reservation._id === id ? updatedReservation : reservation
        )
      );
      return updatedReservation;
    } catch (error) {
      setError("Error al actualizar la reserva");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchReservation = async (query) => {
    if (!query) return reservation; // Retorna todas las reservas si no hay consulta
    try {
      const response = await reservationApi.search(query);
      return response.data || response;
    } catch (error) {
      setError("Error en la búsqueda");
      return reservation.filter(
        (reservation) =>
          reservation.name.toLowerCase().includes(query.toLowerCase()) ||
          reservation.country_of_origin
            .toLowerCase()
            .includes(query.toLowerCase())
      );
    }
  };

  // ReservationContext.jsx
  const downloadPDF = async (reservationId) => {
    try {
      const response = await reservationApi.download(reservationId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    loadReservation();
  }, []);

  return (
    <ReservationContext.Provider
      value={{
        reservation,
        loading,
        error,
        createReservation,
        deleteReservation,
        updateReservation,
        loadReservation,
        searchReservation,
        downloadPDF,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);
