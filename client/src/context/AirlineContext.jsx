import React, { createContext, useContext, useState, useEffect } from "react";
import { airlineApi } from "../api/airlineApi";

// Creamos el contexto global para el uso de la api
const AirlineContext = createContext();

export const AirlineProvider = ({ children }) => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAirlines = async () => {
    try {
      setLoading(true);
      const response = await airlineApi.getAll();
      setAirlines(response.data || response);
    } catch (error) {
      setError("Error al cargar aerolíneas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createAirline = async (airlineData) => {
    try {
      setLoading(true);
      const response = await airlineApi.create(airlineData);
      const newAirline = response.data?.airline || response.airline;
      setAirlines((prev) => [...prev, newAirline]);
      return newAirline;
    } catch (error) {
      setError("Error al crear aerolínea");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAirline = async (id) => {
    try {
      setLoading(true);
      await airlineApi.delete(id);
      setAirlines((prev) => prev.filter((airline) => airline._id !== id));
    } catch (error) {
      setError("Error al eliminar aerolínea");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAirline = async (id, airlineData) => {
    try {
      setLoading(true);
      const response = await airlineApi.update(id, airlineData);
      const updatedAirline = response.data?.airline || response.airline;
      setAirlines((prev) =>
        prev.map((airline) => (airline._id === id ? updatedAirline : airline))
      );
      return updatedAirline;
    } catch (error) {
      setError("Error al actualizar aerolínea");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchAirlines = async (query) => {
    if (!query) return airlines; // Retorna todas las aerolíneas si no hay consulta
    try {
      const response = await airlineApi.search(query);
      return response.data || response;
    } catch (error) {
      setError("Error en la búsqueda");
      return airlines.filter(
      airline =>
        airline.name.toLowerCase().includes(query.toLowerCase()) ||
        airline.country_of_origin.toLowerCase().includes(query.toLowerCase())
      );
    }
    
  };

  useEffect(() => {
    loadAirlines();
  }, []);

  return (
    <AirlineContext.Provider
      value={{
        airlines,
        loading,
        error,
        createAirline,
        deleteAirline,
        updateAirline,
        loadAirlines,
        searchAirlines,
      }}
    >
      {children}
    </AirlineContext.Provider>
  );
};

export const useAirlines = () => useContext(AirlineContext);
