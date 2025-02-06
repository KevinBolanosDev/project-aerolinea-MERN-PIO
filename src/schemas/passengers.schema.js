import { z } from "zod";

const passengerSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),

  middle_name: z.string().optional(),

  last_name: z
    .string({ required_error: "El apellido es obligatorio" })
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),

  second_last_name: z.string().optional(),

  document_type: z.enum(["DNI", "Pasaporte", "Cédula"], {
    required_error: "Tipo de documento es obligatorio",
  }),

  document_number: z
    .string({ required_error: "Número de documento obligatorio" }),

  date_of_birth: z.coerce.date({
    required_error: "Fecha de nacimiento obligatoria",
    invalid_type_error: "Formato inválido (YYYY-MM-DD)",
  }),

  nationality: z.string({ required_error: "La nacionalidad es obligatoria" }),

  gender: z.enum(["masculino", "femenino", "otro"], {
    required_error: "El género es obligatorio",
  }),

  country: z.string({ required_error: "País es obligatorio" }),

  city: z.string({ required_error: "Ciudad es obligatoria" }),

  phone_number: z
    .string()
    .regex(/^\+(?:[0-9]●?){6,14}[0-9]$/, "Formato: +[código][número]"),

  email: z
    .string({ required_error: "Correo electrónico es obligatorio" })
    .email("Correo no es válido"),
});

export default passengerSchema;
