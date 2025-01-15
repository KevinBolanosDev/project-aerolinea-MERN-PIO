import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

//creamos un middleware para validar la autenticacion del token de inicio de sesión
export const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token)
    return res.status(401).json({ message: "No estas autorizado" });
    
    jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({ message: "Token invalido" });

        req.user = user;
        
        next();
    });
};