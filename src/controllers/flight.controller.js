import Flight from "../models/flight.model.js"; // Importamos el modelo de vuelo
import flightSchema from "../schemas/flight.schema.js"; // Importamos la validación con Zod

// Obtener todos los vuelos
export const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find()
      .populate("airplane", "model capacity") // Obtener detalles del avión
      .populate("origin", "name city country") // Datos del aeropuerto de origen
      .populate("destination", "name city country"); // Datos del aeropuerto de destino
    res.status(200).json(flights);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los vuelos", error: error.message });
  }
};

// Obtener un vuelo por ID
export const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate("airplane", "model capacity")
      .populate("origin", "name city country")
      .populate("destination", "name city country");

    if (!flight) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    res.status(200).json(flight);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el vuelo", error: error.message });
  }
};

// Crear un nuevo vuelo
export const createFlight = async (req, res) => {
  try {
    // Convertir fechas de string a Date
    req.body.departure_time = new Date(req.body.departure_time);
    req.body.arrival_time = new Date(req.body.arrival_time);

    // Validamos los datos con Zod antes de guardarlos en la BD
    const validatedData = flightSchema.parse(req.body);

    const newFlight = new Flight(validatedData);
    await newFlight.save();

    res
      .status(201)
      .json({ message: "Vuelo creado exitosamente", flight: newFlight });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el vuelo" });
  }
};

// Actualizar un vuelo
export const updateFlight = async (req, res) => {
  try {
    req.body.departure_time &&= new Date(req.body.departure_time);
    req.body.arrival_time &&= new Date(req.body.arrival_time);
    // Validamos los datos antes de actualizarlos
    const validatedData = flightSchema.parse(req.body);

    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true, // Retorna el vuelo actualizado
        runValidators: true, // Aplica las validaciones de Mongoose
      }
    );

    if (!updatedFlight) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    res
      .status(200)
      .json({
        message: "Vuelo actualizado correctamente",
        flight: updatedFlight,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el vuelo", error: error.message });
  }
};

// Eliminar un vuelo
export const deleteFlight = async (req, res) => {
  try {
    const deletedFlight = await Flight.findByIdAndDelete(req.params.id);

    if (!deletedFlight) {
      return res.status(404).json({ message: "Vuelo no encontrado" });
    }

    res.status(200).json({ message: "Vuelo eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el vuelo", error: error.message });
  }
};

// Buscar vuelos por número de vuelo o estado
export const searchFlights = async (req, res) => {
  try {
    const { flight_number, status } = req.query; // Obtener parámetros de búsqueda desde la URL
    let filter = {};

    if (flight_number) {
      filter.flight_number = { $regex: new RegExp(`^${flight_number}$`, "i") }; // Búsqueda exacta, case-insensitive
    }

    if (status) {
      filter.status = status;
    }

    const flights = await Flight.find(filter)
      .populate("airplane", "model capacity")
      .populate("origin", "name city country")
      .populate("destination", "name city country");

    if (flights.length === 0) {
      return res
        .status(404)
        .json({
          message: "No se encontraron vuelos con los criterios especificados",
        });
    }

    res.status(200).json(flights);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar vuelos", error: error.message });
  }
};
