import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useReservation } from "../context/ReservationContext.jsx"; // Importa el contexto
import { useFlights } from "../context/FlightContext.jsx"; // Importa el contexto de vuelos
import { usePassengers } from "../context/PassengerContext.jsx"; // Importa el contexto de pasajeros
import DataTable from "../components/design/DataTable.jsx";

export default function ReservationForm({}) {
  const [editingReservation, setEditingReservation] = useState(null); // Estado para editar

  const {
    reservation,
    createReservation,
    deleteReservation,
    downloadPDF,
    loading: loadingReservation,
    error: errorReservation,
  } = useReservation();
  const {
    createFlight,
    searchFlights,
    loading: loadingFlight,
    error: errorFlight,
  } = useFlights();
  const {
    createPassenger,
    searchPassengerByName,
    loading: loadingPassenger,
    error: errorPassenger,
  } = usePassengers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleReservation = async (data) => {
    try {
      // Buscar o crear pasajero
      let passenger = await searchPassengerByName(data.document_number);
      if (!passenger) {
        // Crear el pasajero en la base de datos
        passenger = await createPassenger({
          name: data.name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          document_type: data.document_type,
          document_number: data.document_number,
          date_of_birth: data.date_of_birth,
          nationality: data.nationality,
          gender: data.gender,
          country: data.country,
          city: data.city,
          phone_number: data.phone_number,
          email: data.email,
        });
      }

      // Buscar o crear vuelo
      let flight = await searchFlights({ flight_number: data.flight_number });
      if (!flight) {
        //datos pendientes
        flight = await createFlight({});
      }
      // Crear reserva
      const reservationData = {
        passenger: passenger._id,
        flight: flight._id,
        seat_number: data.seat_number,
        price: data.price,
      };
      await createReservation(reservationData);

      console.log("Reserva creado con éxito");
      reset();
    } catch (error) {
      console.error("Error al crear la reserva", error);
    }
  };

  const handleDelete = async (id) => {
    console.log("ID a eliminar:", id); // Para verificar específicamente el ID

    try {
      await deleteReservation(id); // Elimina del servidor
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
    }
  };

  const handleEdit = (reservation) => {
    // Poblar el formulario con los datos existentes
    reset({
      ...reservation,
      passenger: reservation.passenger._id,
      flight: reservation.flight._id,
    });
  };


const handleDownloadPDF = async (reservationId) => {
  try {
    const pdfBuffer = await downloadPDF(reservationId);
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reserva-${reservationId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar:", error);
  }
};

  return (
    <>
      <form onSubmit={handleSubmit(handleReservation)} className="space-y-4">
        <h2 className="text-2xl my-8">Datos del pasajero</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 text-[1.1rem] font-medium text-gray-400">
          <div>
            <label htmlFor="name" className="block mb-1">
              Nombre
            </label>
            <input
              type="text"
              {...register("name", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Segundo nombre</label>
            <input
              type="text"
              {...register("middle_name", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.middle_name && (
              <span className="text-red-500">{errors.middle_name.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Apellido</label>
            <input
              type="text"
              {...register("last_name", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.last_name && (
              <span className="text-red-500">{errors.last_name.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Segundo apellido</label>
            <input
              type="text"
              {...register("second_last_name", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.second_last_name && (
              <span className="text-red-500">
                {errors.second_last_name.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Tipo de documento</label>
            <input
              type="text"
              {...register("document_type", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.document_type && (
              <span className="text-red-500">
                {errors.document_type.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Nº de documento</label>
            <input
              type="text"
              {...register("document_number", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.document_number && (
              <span className="text-red-500">
                {errors.document_number.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Fecha de nacimiento</label>
            <input
              type="text"
              {...register("date_of_birth", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.date_of_birth && (
              <span className="text-red-500">
                {errors.date_of_birth.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Nacionalidad</label>
            <input
              type="text"
              {...register("nationality", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.nationality && (
              <span className="text-red-500">{errors.nationality.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Genero</label>
            <input
              type="text"
              {...register("gender", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.gender && (
              <span className="text-red-500">{errors.gender.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">País</label>
            <input
              type="text"
              {...register("country", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.country && (
              <span className="text-red-500">{errors.country.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Ciudad</label>
            <input
              type="text"
              {...register("city", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.city && (
              <span className="text-red-500">{errors.city.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Telefono de contacto</label>
            <input
              type="text"
              {...register("phone_number", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.phone_number && (
              <span className="text-red-500">
                {errors.phone_number.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Correo electronico</label>
            <input
              type="text"
              {...register("email", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
        </div>
      </form>

      {/* Flight */}
      <form onSubmit={handleSubmit(handleReservation)} className="space-y-4">
        <p className="my-8 text-2xl">Datos del vuelo</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 text-[1.1rem] font-medium text-gray-400">
          <div>
            <label className="block mb-1">Origen</label>
            <input
              type="text"
              {...register("origin", {
                required: "El número de tickete es obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener mínimo 5 caracteres",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.origin && (
              <span className="text-red-500">{errors.origin.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Destino</label>
            <input
              type="text"
              {...register("destination", {
                required: "El número de asiento es obligatorio",
                minLength: {
                  value: 1,
                  message: "Debe tener mínimo 1 carácter",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.destination && (
              <span className="text-red-500">{errors.destination.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Fecha de salida</label>
            <input
              type="text"
              {...register("departure_time", {
                required: "El número de asiento es obligatorio",
                minLength: {
                  value: 1,
                  message: "Debe tener mínimo 1 carácter",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.departure_time && (
              <span className="text-red-500">
                {errors.departure_time.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Fecha de llegada</label>
            <input
              type="text"
              {...register("arrival_time", {
                required: "El número de asiento es obligatorio",
                minLength: {
                  value: 1,
                  message: "Debe tener mínimo 1 carácter",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.arrival_time && (
              <span className="text-red-500">
                {errors.arrival_time.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Clase</label>
            <select
              {...register("clase", {
                required: "La clase es obligatoria",
              })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Seleccione una clase</option>
              <option value="economica">Económica</option>
              <option value="ejecutiva">Ejecutiva</option>
              <option value="primera clase">Primera Clase</option>
            </select>
            {errors.clase && (
              <span className="text-red-500">{errors.clase.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Estado actual</label>
            <select
              {...register("estado", {
                required: "El estado es obligatorio",
              })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Seleccione un estado</option>
              <option value="emitido">Emitido</option>
              <option value="usado">Usado</option>
              <option value="cancelado">Cancelado</option>
              <option value="expirado">Expirado</option>
            </select>
            {errors.estado && (
              <span className="text-red-500">{errors.estado.message}</span>
            )}
          </div>
          <div>
            <label className="block mb-1">Fecha de emisión</label>
            <input
              type="date"
              {...register("fecha_emision", {
                required: "La fecha de emisión es obligatoria",
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.fecha_emision && (
              <span className="text-red-500">
                {errors.fecha_emision.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Fecha límite</label>
            <input
              type="date"
              {...register("fecha_limite", {
                required: "La fecha límite es obligatoria",
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.fecha_limite && (
              <span className="text-red-500">
                {errors.fecha_limite.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Precio total</label>
            <input
              type="number"
              {...register("precio", {
                required: "El precio es obligatorio",
                min: {
                  value: 0,
                  message: "El precio debe ser mayor o igual a 0",
                },
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.precio && (
              <span className="text-red-500">{errors.precio.message}</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loadingFlight || loadingReservation
            ? "Guardando..."
            : "Crear Reserva"}
        </button>
      </form>

      <DataTable
        data={reservation}
        headers={[
          { key: "passenger.name", label: "nombre" },
          { key: "passenger.last_name", label: "apellido" },
          { key: "passenger.document_number", label: "Documento" },
          { key: "passenger.nationality", label: "Nacionalidad" },
          { key: "flight.flight_number", label: "Vuelo" },
          { key: "flight.origin.name", label: "Origen" },
          { key: "flight.origin.city", label: "ciudad" },
          { key: "flight.origin.country", label: "pais" },
          { key: "flight.destination.name", label: "Destino" },
          { key: "flight.destination.city", label: "ciudad" },
          { key: "flight.destination.country", label: "pais" },
          { key: "seat_number", label: "Asiento" },
          { key: "status", label: "estado" },
          { key: "price", label: "precio" },
        ]}
        idField="_id"
        onDelete={handleDelete}
        onEdit={handleEdit}
        onDownload={handleDownloadPDF}
      />
    </>
  );
}
