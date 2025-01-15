import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; //para encriptar la contraseña
import { createToken } from "../libs/jwt.js"; //  importamos la función para crear el token
import jwt from "jsonwebtoken"; //importamos el jwt para verificar el token
import { TOKEN_SECRET } from "../config.js";

//resgistro de usuarios
export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["El email ya está registrado"]);

    //encriptamos la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: passwordHash,
      username,
    });

    //devolvemos el usuario creado
    const userSaved = await newUser.save();

    // creamos el token de autenticación
    const token = await createToken({ id: userSaved._id });

    //guardamos el token en una cookie
    res.cookie("token", token);

    //y enviamos el usuario creado al frontend
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login de usuarios
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    //si el usuario no existe
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    //comparamos las contraseñas para el login
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // creamos el token para usuario guardado
    const token = await createToken({ id: userFound._id });
    //guardamos el token en una cookie
    res.cookie("token", token);
    //y enviamos el usuario creado al frontend
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//logout de usuarios
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

//perfil de usuarios
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

//verificar el token para comprobar si el usuario ya tiene un token y pasarlo por el jwt
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,      
    });
  });
};
