import { z } from "zod";

const gatesEnum = [
  "E12",
  "G18",
  "H24",
  "F34",
  "D15",
  "G17",
  "S19",
  "E23",
  "H17",
];

const airportSchema = z.object({
  name: z
    .string({
      required_error: "El nombre del aeropuerto es obligatorio",
    })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),

  city: z
    .string({
      required_error: "La ciudad es obligatoria",
    })
    .trim(),

  country: z
    .string({
      required_error: "El país es obligatorio",
    })
    .trim(),

  iata_code: z
    .string({ required_error: "El código IATA es obligatorio" })
    .trim()
    .length(3, "El código IATA debe tener 3 caracteres")
    .regex(/^[A-Z]+$/, "Solo letras mayúsculas"),

  gates: z.enum(gatesEnum, {
    required_error: "La puerta de embarque es obligatoria",
    invalid_type_error: `Puertas válidas: ${gatesEnum.join(", ")}`,
  }),
  
  status: z
    .enum(["activo", "cerrado"], {
      required_error: "El status es obligatorio",
      invalid_type_error: "El status debe ser (activo/cerrado)",
    })
    .default("activo"),
});

export default airportSchema;
