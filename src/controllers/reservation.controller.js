import Reservation from "../models/reservation.model.js";
import Flight from "../models/flight.model.js";
import Airport from "../models/airport.model.js";
import Passenger from "../models/passengers.model.js";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea una nueva reserva
export const createReservation = async (req, res) => {
  try {
    const { flight, passenger, seat_number, price, status } = req.body;

    // Verificar asiento no ocupado
    const existingReservation = await Reservation.findOne({
      flight: req.body.flight,
      seat_number: req.body.seat_number,
    });
    if (existingReservation) {
      return res.status(400).json({ message: "Asiento ya ocupado" });
    }

    // Verificar si el vuelo y el pasajero existen
    const flightExists = await Flight.findById(flight);
    const passengerExists = await Passenger.findById(passenger);

    if (!flightExists) {
      return res.status(404).json({ message: "El vuelo no existe" });
    }
    if (!passengerExists) {
      return res.status(404).json({ message: "El pasajero no existe" });
    }

    // Crear la reserva
    const newReservation = new Reservation({
      flight,
      passenger,
      seat_number,
      price,
      status,
    });
    await newReservation.save();

    res.status(201).json({
      message: "Reserva creada exitosamente",
      reservation: newReservation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la reserva", error: error.message });
  }
};

/**
 * Obtener todas las reservas con información del vuelo y pasajero
 */
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
    .populate({
      path: "flight",
      populate: [ // ✅ Poblar origen y destino como objetos completos
        { path: "origin", select: "name city country" },
        { path: "destination", select: "name city country" }
      ]
    })
    .populate("passenger"); // Poblar datos del pasajero

    res.status(200).json(reservations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener reservas", error: error.message });
  }
};

/**
 * Obtener una reserva por ID
 */
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id)
      .populate(
        "flight",
        "flight_number origin destination departure_time arrival_time status"
      )
      .populate(
        "passenger",
        "name middle_name last_name second_last_name document_type document_number nationality email"
      )

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la reserva", error: error.message });
  }
};

/**
 * Actualizar una reserva por ID
 */
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { seat_number, price, status } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { seat_number, price, status },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({
      message: "Reserva actualizada",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la reserva",
      error: error.message,
    });
  }
};

/**
 * Eliminar una reserva por ID
 */
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la reserva", error: error.message });
  }
};

/**
 * Buscar reservas por número de documento del pasajero o número de vuelo
 */
export const searchReservations = async (req, res) => {
  try {
    const { document_number, flight_number } = req.query;

    // Construimos el filtro dinámicamente según los parámetros recibidos
    let filter = {};

    if (document_number) {
      const passenger = await Passenger.findOne({ document_number });
      if (!passenger) {
        return res.status(404).json({ message: "Pasajero no encontrado" });
      }
      filter.passenger = passenger._id; // Filtramos por ID de pasajero
    }

    if (flight_number) {
      const flight = await Flight.findOne({ flight_number });
      if (!flight) {
        return res.status(404).json({ message: "Vuelo no encontrado" });
      }
      filter.flight = flight._id; // Filtramos por ID de vuelo
    }

    // Buscamos reservas con los filtros aplicados
    const reservations = await Reservation.find(filter)
      .populate("flight", "flight_number departure_time arrival_time status")
      .populate("passenger", "name last_name document_number");

    if (reservations.length === 0) {
      return res.status(404).json({ message: "No se encontraron reservas" });
    }

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Error en la búsqueda de reservas",
      error: error.message,
    });
  }
};

const getAirportDetails = async (airportId) => {
  if (!airportId) return null;
  return await Airport.findById(airportId).select("name city country")
};

const getBase64Image = async (filePath) => {
  try {
    const imageBuffer = await fs.readFile(filePath);
    return `data:image/png;base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error al convertir la imagen a Base64:", error);
    return null;
  }
};

const logoPath = path.join(__dirname, "..", "public", "logo.png"); // Ruta de la imagen
const logoBase64 = await getBase64Image(logoPath); // Convertir imagen a Base64


// Generar PDF de una reserva y enviarlo por correo al descargarlo
export const seeReservationPDF = async (req, res) => {
  let browser;
  try {
    console.log("Generando PDF para la reserva ID:", req.params.id);

    const { id } = req.params;
    const reservation = await Reservation.findById(id)
      .populate({
        path: "flight",
        select: "flight_number departure_time arrival_time status",
        populate: [
          { path: "origin", model: "Airport", select: "name city country" },
          { path: "destination", model: "Airport", select: "name city country" },
        ],
      })
      .populate(
        "passenger", 
        "name last_name email document_number"
      )

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    const origin = await getAirportDetails(reservation.flight.origin);
    const destination = await getAirportDetails(reservation.flight.destination)

    // Construir la ruta absoluta al template
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "reservation.html"
    );
    console.log("Ruta del template:", templatePath); // Para debugging

    // Leer el template HTML
    const templateHtml = await fs.readFile(templatePath, "utf-8");

    // Compilar template con Handlebars
    const template = handlebars.compile(templateHtml);
    const html = template({
      logo: logoBase64,
      reservation_id: reservation._id,
      passenger_name: `${reservation.passenger.name} ${reservation.passenger.last_name}`,
      document_number: reservation.passenger.document_number,
      flight_number: reservation.flight.flight_number,
      origin: origin
      ? `${origin.name}, ${origin.city}, ${origin.country}`
      : "Información no disponible",
      destination: destination
      ? `${destination.name}, ${destination.city}, ${destination.country}`
      : "Información no disponible",
      departure_time: new Date(
        reservation.flight.departure_time
      ).toLocaleString(),
      arrival_time: new Date(reservation.flight.arrival_time).toLocaleString(),
      status: reservation.status,
      qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${reservation._id}`,
    });

    // Iniciar Puppeteer
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Configurar página
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 3000,
    });
    await page.emulateMediaType("screen");

    // Generar PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    // Enviar PDF por correo
    await sendEmailReservation(reservation.passenger.email, pdfBuffer);

    // Configurar headers para la descarga
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="reserva-${id}.pdf"`,
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: 0,
    });

    // Enviar PDF como respuesta
    return res.end(pdfBuffer);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    if (browser) {
      await browser.close();
    }
    res
      .status(500)
      .json({ message: "Error al generar el PDF", error: error.message });
  }
};

// Función para enviar el PDF por correo automáticamente
const sendEmailReservation = async (email, pdfData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "programmerslowgravity@gmail.com",
      to: email,
      subject: "Detalles de tu Reserva",
      text: "Adjunto encontrarás el PDF con los detalles de tu reserva.",
      attachments: [
        {
          filename: "reserva.pdf",
          content: pdfData,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${email}`);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};
