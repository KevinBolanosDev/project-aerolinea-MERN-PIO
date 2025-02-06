import React from "react";
import { AirportProvider } from "./AirportContext.jsx";
import { AirlineProvider } from "./AirlineContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { AirplaneProvider } from "./AirplaneContext.jsx";
import { ReservationProvider } from "./ReservationContext.jsx";
import { FlightProvider } from "./FlightContext.jsx";
import { PassengerProvider } from "./PassengerContext.jsx";
// Importa otros contextos aquí
// import { AnotherProvider } from './AnotherContext';

const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AirlineProvider>
        <AirportProvider>
          <AirplaneProvider>
            <FlightProvider>
              <PassengerProvider>
                <ReservationProvider>
                  {/* Envuelve otros contextos aquí */}
                  {children}
                </ReservationProvider>
              </PassengerProvider>
            </FlightProvider>
          </AirplaneProvider>
        </AirportProvider>
      </AirlineProvider>
    </AuthProvider>
  );
};

export default AppProvider;
