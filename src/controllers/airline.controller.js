import airlineSchema from "../schemas/airline.schema.js";
import Airline from "../models/airline.model.js";

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
export const getAirlines = async (req, res) => {
  try {
    const airlines = await Airline.find().sort({ createdAt: -1 });
    res.json(airlines);
  } catch (error) {
    return handleError(res, error, "Error al obtener las aerolíneas");
  }
};

// Obtener una aerolínea por ID
export const getAirline = async (req, res) => {
  try {
    const airline = await Airline.findById(req.params.id);
    if (!airline) {
      return res.status(404).json({ message: "Aerolínea no encontrada" });
    }
    res.json(airline);
  } catch (error) {
    return handleError(res, error, "Error al obtener la aerolínea");
  }
};

// Crear una nueva aerolínea
export const createAirline = async (req, res) => {
  try {
    const validatedData = airlineSchema.parse(req.body);
    const newAirline = new Airline(validatedData);
    const savedAirline = await newAirline.save();

    res.status(201).json({
      message: "Aerolínea creada exitosamente",
      airline: savedAirline,
    });
  } catch (error) {
    return handleError(res, error, "Error al crear la aerolínea");
  }
};

// Actualizar una aerolínea
export const updateAirline = async (req, res) => {
  try {
    const validatedData = airlineSchema.parse(req.body);
    const updatedAirline = await Airline.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedAirline) {
      return res.status(404).json({ message: "Aerolínea no encontrada" });
    }

    res.json({
      message: "Aerolínea actualizada exitosamente",
      airline: updatedAirline,
    });
  } catch (error) {
    return handleError(res, error, "Error al actualizar la aerolínea");
  }
};

// Eliminar una aerolínea
export const deleteAirline = async (req, res) => {
  try {
    const deleteAirline = await Airline.findByIdAndDelete(req.params.id);

    if (!deleteAirline) {
      return res.status(404).json({ message: "Aerolínea no encontrada" });
    }

    res.json({
      message: "Aerolínea eliminada exitosamente",
      airline: deleteAirline,
    });
  } catch (error) {
    return handleError(res, error, "Error al eliminar la aerolínea");
  }
};

// Cambiar el status de una aerolínea
export const changeAirlineStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["activo", "inactivo"].includes(status)) {
      return res.status(400).json({
        message: "Status inválido. Debe ser 'activo' o 'inactivo'",
      });
    }

    const updatedAirline = await Airline.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedAirline) {
      return res.status(404).json({ message: "Aerolínea no encontrada" });
    }

    res.json({
      message: "Status de aerolínea actualizado exitosamente",
      airline: updatedAirline,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Error al actualizar el status de la aerolínea"
    );
  }
};

// Buscar una aerolínea por nombre
export const searchAirlineByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({
          message: "El nombre de la aerolínea es obligatorio para la busqueda",
        });
    }

    const airlines = await Airline.find({
      name: { $regex: new RegExp(name, "i") }, // Búsqueda insensible a mayúsculas/minúsculas
    });

    res.json(airlines);
  } catch (error) {
    return handleError(res, error, "No se encontrarón resultados");
  }
};
