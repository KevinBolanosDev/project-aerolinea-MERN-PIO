import {z} from "zod";

const airlineSchema = z.object({
  name: z.string({
    required_error: "El nombre es obligatorio",
  }).trim(),
  legal_name: z.string({
    required_error: "El nombre legal es obligatorio",
  }).trim(),
  country_of_origin: z.string({
    required_error: "El país de origen es obligatorio",
  }).trim(),
  number_of_employees: z
    .number({
      required_error: "Debe agregar un valor obligatorio",
      invalid_type_error: "El número de empleados debe ser un número",
    })
    .int("Debe ser un número entero")
    .nonnegative("El número de empleados debe ser mayor o igual a 0"),
  main_office: z.string({
    required_error: "La oficina principal es obligatoria",
  }).trim(),
  phone: z
    .string({
      required_error: "El teléfono es obligatorio",
    })
    .regex(/^\+?[0-9\s\-()]+$/, "Debe ser un número de teléfono válido"),
  email: z
    .string({
      required_error: "Correo electrónico es obligatorio",
    })
    .email("Debe ser un correo electrónico válido")
    .transform((email) => email.toLowerCase().trim()),
  number_of_airplanes: z
    .number({
      required_error: "El número de aviones es obligatorio",
      invalid_type_error: "Debe ser un número",
    })
    .int("Debe ser un número entero")
    .nonnegative("El número de aviones debe ser mayor o igual a 0"),
  status: z
    .enum(["activo", "suspendida", "inactivo"], {
      required_error: "El status es obligatorio",
      invalid_type_error: "El status debe ser 'activo' o 'inactivo'",
    })
    .default("activo"),
});

export default airlineSchema;