import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";
import "dotenv/config"

const app = express();

//Permitimos que los dominios se comuniquen entre seervidores, en este caso se conecta al frontend
app.use(
  cors({
    origin: "https://airline-gravity.netlify.app/",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Llamamos todas las rutas en general del index.js de routes
app.use("/api", routes);

export default app;
