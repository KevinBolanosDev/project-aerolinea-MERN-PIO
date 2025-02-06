import airportSchema from "../schemas/airport.schema.js";
import Airport from "../models/airport.model.js";

// Manejo de errores comunes
const handleError = (res, error, defaultMessage) => {
  if (error.errors) {
    return res.status(400).json({
      message: "Error de validación",
      errors: error.errors,
    });
  }
  return res.status(500).json({
    message: defaultMessage,
    error: error.message,
  });
};

// Obtener todas las aerolíneas
export const getAirports = async (req, res) => {
  try {
    const airport = await Airport.find().sort({ createdAt: -1 });
    res.json({
      message: "Aeropuertos encontrados",
      airport,
    });
  } catch (error) {
    return handleError(res, error, "Error al obtener los aeropuertos");
  }
};

// Obtener una aerolínea por ID
export const getAirport = async (req, res) => {
  try {
    const airport = await Airport.findById(req.params.id);
    if (!airport) {
      return res.status(404).json({ message: "Aeropuerto no encontrado" });
    }
    res.status(200).json({
      message: "Aeropuerto encontrado",
      airport,
    });
  } catch (error) {
    return handleError(res, error, "Error al obtener el aeropuerto");
  }
};

// Crear una nueva aerolínea
export const createAirport = async (req, res) => {
  try {
    const validatedData = airportSchema.parse(req.body);
    const newAirport = new Airport(validatedData);
    const savedAirport = await newAirport.save();

    res.status(201).json({
      message: "Aeropuerto creado exitosamente",
      airport: savedAirport,
    });
  } catch (error) {
    return handleError(res, error, "Error al crear el aeropuerto");
  }
};

// Actualizar una aerolínea
export const updateAirport = async (req, res) => {
  try {
    const validatedData = airportSchema.parse(req.body);
    const updatedAirport = await Airport.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedAirport) {
      return res.status(404).json({ message: "Aeropuerto no encontrado" });
    }

    res.json({
      message: "Aeropuerto actualizado exitosamente",
      airport: updatedAirport,
    });
  } catch (error) {
    return handleError(res, error, "Error al actualizar el aeropuerto");
  }
};

// Eliminar una aerolínea
export const deleteAirport = async (req, res) => {
  try {
    const deleteAirport = await Airport.findByIdAndDelete(req.params.id);

    if (!deleteAirport) {
      return res.status(404).json({ message: "Aeropuerto no encontrado" });
    }

    res.json({
      message: "Aeropuerto eliminado exitosamente",
      airport: deleteAirport,
    });
  } catch (error) {
    return handleError(res, error, "Error al eliminar el aeropuerto");
  }
};

// Buscar una aerolínea por nombre
export const searchAirportByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const airport = await Airport.find({
      name: { $regex: new RegExp(name, "i") }, // Búsqueda insensible a mayúsculas/minúsculas
    });

    res.json(airport);
  } catch (error) {
    return handleError(res, error, "No se encontrarón resultados");
  }
};
