import { createContext, useContext, useState, useEffect } from "react";
import { flightApi } from "../api/flightApi";

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const data = await flightApi.getFlights();
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFlight = async (id) => {
    try {
      return await flightApi.getFlightById(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const addFlight = async (flightData) => {
    try {
      const newFlight = await flightApi.createFlight(flightData);
      setFlights([...flights, newFlight]);
    } catch (err) {
      setError(err.message);
    }
  };

  const editFlight = async (id, flightData) => {
    try {
      const updatedFlight = await flightApi.updateFlight(id, flightData);
      setFlights(flights.map(flight => (flight._id === id ? updatedFlight : flight)));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFlight = async (id) => {
    try {
      await flightApi.deleteFlight(id);
      setFlights(flights.filter(flight => flight._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const findFlights = async (filters) => {
    try {
      const results = await flightApi.searchFlights(filters);
      setFlights(results);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <FlightContext.Provider
      value={{ flights, loading, error, fetchFlights, getFlight, addFlight, editFlight, removeFlight, findFlights }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export const useFlights = () => useContext(FlightContext);
