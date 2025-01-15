import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
  verifyToken,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

// validateSchema, se pasa antes de la función register para validar los datos que se reciben, además se le pasa la prop registerSchema que es el middleware, esquema de validación de los datos que se reciben
router.post("/register", validateSchema(registerSchema), register);

// lo mismo con el login de los usuarios
router.post("/login", validateSchema(loginSchema), login);

router.post("/logout", logout);

router.get("/verify", verifyToken);

// authRequired, se pasa antes de la función profile para validar el token y que esta autorizado el inicio de la sesion
router.get("/profile", authRequired, profile);

export default router;
