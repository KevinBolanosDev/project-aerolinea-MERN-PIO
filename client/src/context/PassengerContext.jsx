// src/context/PassengerContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { passengerApi } from "../api/passengerApi"; // Importar funciones de la API

// Crear el contexto
const PassengerContext = createContext();

// Proveedor del contexto
export const PassengerProvider = ({ children }) => {
  const [passengers, setPassengers] = useState([]); // Lista de pasajeros
  const [currentPassenger, setCurrentPassenger] = useState(null); // Pasajero seleccionado para edición o vista
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener pasajeros al cargar el contexto
  useEffect(() => {
    getPassengers();
  }, []);

  // 1️⃣ Obtener todos los pasajeros
  const getPassengers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const data = await passengerApi.getPassengers(page, limit);

      // Filtramos datos relevantes
      const filteredPassengers = data.passengers.map(({ _id, name, last_name, document_type, document_number, email }) => ({
        _id, 
        name, 
        last_name, 
        document_type, 
        document_number, 
        email,
      }));

      setPassengers(filteredPassengers); // Se guardan los datos necesarios
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Obtener un pasajero por ID
  const getPassengerById = async (id) => {
    setLoading(true);
    try {
      const passenger = await passengerApi.getPassengerById(id);
      setCurrentPassenger(passenger);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Crear un nuevo pasajero
  const createPassenger = async (passengerData) => {
    setLoading(true);
    try {
      const newPassenger = await passengerApi.createPassenger(passengerData);
      setPassengers([...passengers, newPassenger]); // Agregar al estado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ Actualizar un pasajero
  const editPassenger = async (id, updatedData) => {
    setLoading(true);
    try {
      const updatedPassenger = await passengerApi.updatePassenger(id, updatedData);
      setPassengers(passengers.map((p) => (p._id === id ? updatedPassenger : p)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ Eliminar un pasajero
  const deletePassenger = async (id) => {
    setLoading(true);
    try {
      await passengerApi.deletePassenger(id);
      setPassengers(passengers.filter((p) => p._id !== id)); // Eliminar del estado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 6️⃣ Buscar pasajeros por nombre
  const searchPassengerByName = async (name) => {
    setLoading(true);
    try {
      const foundPassengers = await passengerApi.searchPassengerByName(name);
      setPassengers(foundPassengers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PassengerContext.Provider
      value={{
        passengers,
        currentPassenger,
        loading,
        error,
        getPassengers,
        getPassengerById,
        createPassenger,
        editPassenger,
        deletePassenger,
        searchPassengerByName,
        setCurrentPassenger, // Para limpiar selección
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
};
 
// Hook personalizado para usar el contexto
export const usePassengers = () => {
  return useContext(PassengerContext);
};
