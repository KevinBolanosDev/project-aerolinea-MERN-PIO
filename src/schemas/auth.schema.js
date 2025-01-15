import { z } from "zod";

//"npm i zod" hacemos las validaciones de los datos que se reciben
export const registerSchema = z.object({
  username: z
    .string({
      required_error: "Nombre de usuario es requerido",
    })
    .min(4, {
      message: "El nombre de usuario debe tener al menos 4 caracteres",
    }),
  email: z
    .string({
      required_error: "Email es requerido",
    })
    .email({
      message: "Email no es valido",
    }),
  password: z
    .string({
      required_error: "Contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email es requerido",
    })
    .email({
      message: "Email no es valido",
    }),
  password: z
    .string({
      required_error: "Contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
});
