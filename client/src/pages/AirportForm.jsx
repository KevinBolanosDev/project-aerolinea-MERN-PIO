import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAirport } from "../context/AirportContext";
import DataTable from "../components/design/DataTable";

export default function AirportForm() {
  const {
    createAirport,
    updateAirport,
    deleteAirport,
    searchAirport,
    airport,
    loading,
    error,
  } = useAirport();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingAirport, setEditingAirport] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editingAirport) {
      Object.keys(editingAirport).forEach((key) => setValue(key, editingAirport[key]));
    } else {
      reset();
    }
  }, [editingAirport, setValue, reset]);

  const onSubmit = async (data) => {
    if (editingAirport) {
      await updateAirport(editingAirport._id, data);
      setEditingAirport(null);
    } else {
      await createAirport(data);
    }
    reset();
  };

  const handleEdit = (airport) => {
    setEditingAirport(airport);
  };

  const handleDelete = async (id) => {
    await deleteAirport(id);
    setEditingAirport(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    searchAirport(e.target.value);
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="name" className="block mb-1">
          Nombre del Aeropuerto
        </label>
        <input
          type="text"
          {...register("name", {
            minLength: {
              value: 5,
              message: "Debe tener minimo 5 caracteres",
            },
            required: {
              value: true,
              message: "El nombre del aeropuerto es obligatorio",
            },
            maxLength: {
              value: 30,
              message: "El nombre no puede exceder los 30 caracteres",
            },
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="city" className="block mb-1">
          Ciudad
        </label>
        <input
          type="text"
          {...register("city", {
            required: {
              value: true,
              message: "El nombre de la ciudad es requerido",
            }, 
            maxLength: {
              value: 30,
              message:
                "El nombre de la ciudad no puede exceder los 30 caracteres",
            },
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.city && (
          <span className="text-red-500">{errors.city.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="country" className="block mb-1">
          Pais
        </label>
        <input
          type="text"
          {...register("country", {
            required: {
              value: true,
              message: "El nombre del pais es requerido",
            },
            maxLength: {
              value: 30,
              message: "El nombre del pais no puede exceder los 30 caracteres",
            },
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.country && (
          <span className="text-red-500">{errors.country.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="iata_code" className="block mb-1">
          Codigo IATA
        </label>
        <input
          type="text"
          {...register("iata_code", {
            required: {
              value: true,
              message: "El codigo IATA es requerido",
            },
            maxLength: {
              value: 3,
              message: "El codigo IATA no puede exceder los 3 caracteres",
            },
            pattern: {
              value: /^[A-Z]{3}$/,
              message: "Solo se permiten letras mayusculas y 3 caracteres",
            },
          })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.iata_code && (
          <span className="text-red-500">{errors.iata_code.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="gates" className="block mb-1">
          Puerta de embarque
        </label>
        <input
          type="text"
          {...register("gates", {
            required: {
              value: true,
              message: "El estado es requerido",
            },
            maxLength: {
              value: 30,
              message: "El estado no puede exceder los 30 caracteres",
            },
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.gates && (
          <span className="text-red-500">{errors.gates.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="state" className="block mb-1">
          Estado
        </label>
        <input
          type="text"
          {...register("state", {
            required: {
              value: true,
              message: "El estado es requerido",
            },
            maxLength: {
              value: 30,
              message: "El estado no puede exceder los 30 caracteres",
            },
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.state && (
          <span className="text-red-500">{errors.state.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Guardando..." : editingAirport ? "Actualizar Aeropuerto" : "Agregar Aeropuerto"}
      </button>
    </form>

    <div className="mt-4">
        <input
          type="text"
          placeholder="Buscar aeropuerto..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <DataTable data={airport} idField={"_id"} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}
