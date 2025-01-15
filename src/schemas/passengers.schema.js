const { z } = require("zod");

const passengerSchema = z.object({
  name: z.string({
    required_error: "El nombre es obligatorio",
  }),
  middle_name: z.string(),
  last_name: z.string({
    required_error: "El apellido es obligatorio",
  }),
  second_last_name: z.string(),
  document_type: z
    .string({
      required_error: "Tipo de documento es obligatorio",
    }),
  document_number: z.string({
    required_error: "numero de documento es obligatorio",
  }),
  date_of_birth: z.date({
    required_error: "La fecha de nacimiento es obligatorio"
  }),
  nationality: z
    .string({
      required_error: "La nacionalidad es obligatoria",
    }),
  gender: z
    .enum({
        masculino,
        femenino,
        otro
    }),
  country: z.string({
    required_error: "País es obligatorio",
  }),
  city: z.string({
    required_error: "Ciudad es obligatorio",
  }),
  number_phone: z.number({
    required_error: "Debe agregar un telefono obligatorio",
  }),
  email: z
    .string({
      required_error: "Correo electronico es obligatorio",
    })
    .email({
      message: "Correo no es valido",
    }),
});

module.exports = {
  passengerSchema,
};
