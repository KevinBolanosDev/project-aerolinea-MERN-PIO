import Passenger from "../models/passengers.model.js";
import passengerSchema from "../schemas/passengers.schema.js";

// Obtener todos los pasajeros con paginación
export const getPassengers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const passengers = await Passenger.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Passenger.countDocuments();
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      passengers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pasajeros", error });
  }
};

// Obtener un pasajero por ID
export const getPassengerById = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: "Pasajero no encontrado" });
    }
    res.json(passenger);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pasajero", error });
  }
};

// Crear un nuevo pasajero
export const createPassenger = async (req, res) => {
  try {
    // Validar con Zod
    const validation = passengerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    // Verificar documento único según tipo
    const existingPassenger = await Passenger.findOne({
      $or: [
        { email: req.body.email },
        { document_number: req.body.document_number },
      ],
    });

    if (existingPassenger) {
      return res
        .status(400)
        .json({ message: "El pasajero ya está registrado" });
    }

    const newPassenger = new Passenger(req.body);
    await newPassenger.save();
    res.status(201).json(newPassenger);
  } catch (error) {
    res.status(500).json({ message: "Error creando pasajero", error });
  }
};

// Actualizar un pasajero por ID
export const updatePassenger = async (req, res) => {
  try {
    // Validar con Zod
    const validation = passengerSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const updatedPassenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPassenger) {
      return res.status(404).json({ message: "Pasajero no encontrado" });
    }

    res.json(updatedPassenger);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando pasajero", error });
  }
};

// Eliminar un pasajero por ID
export const deletePassenger = async (req, res) => {
  try {
    const deletedPassenger = await Passenger.findByIdAndDelete(req.params.id);
    if (!deletedPassenger) {
      return res.status(404).json({ message: "Pasajero no encontrado" });
    }
    res.json({ message: "Pasajero eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando pasajero", error });
  }
};

// Buscar una aerolínea por nombre
export const searchPassengerByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "El nombre del pasajero es obligatorio",
      });
    }

    const passenger = await Passenger.find({
      name: { $regex: new RegExp(name, "i") }, // Búsqueda insensible a mayúsculas/minúsculas
    });

    res.json(passenger);
  } catch (error) {
    return handleError(res, error, "No se encontrarón resultados");
  }
};
