export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors.map((err) => ({
          field: err.path.join("."), // Campo afectado
          message: err.message, // Mensaje de error
        })),
      });
    }
    // Manejo de errores inesperados
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
