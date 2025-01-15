import Airplane from "../models/airplane.model.js";
import airplaneSchema from "../schemas/airplane.schema.js";

// Obtener todos los aviones
export const getAirplanes = async (req, res) => {
  try {
    const airplanes = await Airplane.find()
      .populate("airline", "name country_of_origin number_ofemployees status main_office") // Obtener detalles de la aerolínea
      .sort({ createdAt: -1 });
    res.json(airplanes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los aviones", error: error.message });
  }
};

// Obtener un avión por ID
export const getAirplane = async (req, res) => {
  try {
    const airplane = await Airplane.findById(req.params.id).populate("airline", "name country_of_origin");
    if (!airplane) {
      return res.status(404).json({ message: "Avión no encontrado" });
    }
    res.json(airplane);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el avión", error: error.message });
  }
};

// Crear un nuevo avión
export const createAirplane = async (req, res) => {
  try {
    // Validar datos con Zod
    const validatedData = airplaneSchema.parse(req.body);

    const newAirplane = new Airplane(validatedData);
    const savedAirplane = await newAirplane.save();

    res.status(201).json({
      message: "Avión creado exitosamente",
      airplane: savedAirplane,
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Error al crear el avión", error: error.message });
  }
};

// Actualizar un avión
export const updateAirplane = async (req, res) => {
  try {
    // Validar datos con Zod
    const validatedData = airplaneSchema.parse(req.body);

    const updatedAirplane = await Airplane.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAirplane) {
      return res.status(404).json({ message: "Avión no encontrado" });
    }

    res.json({
      message: "Avión actualizado exitosamente",
      airplane: updatedAirplane,
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Error al actualizar el avión", error: error.message });
  }
};

// Eliminar un avión
export const deleteAirplane = async (req, res) => {
  try {
    const deletedAirplane = await Airplane.findByIdAndDelete(req.params.id);

    if (!deletedAirplane) {
      return res.status(404).json({ message: "Avión no encontrado" });
    }

    res.json({
      message: "Avión eliminado exitosamente",
      airplane: deletedAirplane,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el avión", error: error.message });
  }
};

// Buscar aviones por modelo
export const searchAirplanesByModel = async (req, res) => {
    try {
      const { model } = req.query; // Se obtiene el modelo desde los parámetros de consulta
      if (!model) {
        return res.status(400).json({ message: "El modelo es obligatorio para la búsqueda" });
      }
  
      const airplanes = await Airplane.find({ model: new RegExp(model, "i") }) // Búsqueda insensible a mayúsculas/minúsculas
        .populate("airline", "name country_of_origin");
  
      res.json(airplanes);
    } catch (error) {
      res.status(500).json({ message: "Error al buscar aviones por modelo", error: error.message });
    }
  };
  
// Buscar aviones por estado
  export const filterAirplanesByStatus = async (req, res) => {
    try {
      const { status } = req.query; // Se obtiene el estado desde los parámetros de consulta
  
      if (!status || !["activo", "en mantenimiento", "inactivo"].includes(status)) {
        return res.status(400).json({
          message: "El estado es obligatorio y debe ser 'activo', 'en mantenimiento' o 'inactivo'",
        });
      }
  
      const airplanes = await Airplane.find({ status })
        .populate("airline", "name country_of_origin");
  
      res.json(airplanes);
    } catch (error) {
      res.status(500).json({ message: "Error al filtrar aviones por estado", error: error.message });
    }
  };