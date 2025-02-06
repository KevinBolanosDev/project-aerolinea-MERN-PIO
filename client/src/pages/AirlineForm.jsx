// Componente nieto de App e hijo de RenderForm

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAirlines } from "../context/AirlineContext";
import DataTable from "../components/design/DataTable";

export default function AirlineFormPage({}) {
  const {
    createAirline,
    deleteAirline,
    updateAirline,
    loading,
    error,
    airlines,
    searchAirlines,
  } = useAirlines();
  // const [airlines, setAirlines] = useState(""); // Estado local para controlar los datos
  const [editingAirline, setEditingAirline] = useState(null); // Estado para editar
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [searchResults, setSearchResults] = useState([]); // Estado para almacenar resultados de búsqueda

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm(); // manejo de error react-hook-forms

  const FormSubmit = async (data) => {
    try {
      const transformedData = {
        ...data,
        number_of_employees: parseInt(data.number_of_employees, 10), // Convertir a número
        number_of_airplanes: parseInt(data.number_of_airplanes, 10), // Convertir a número
        name: data.name.trim(), // Eliminar espacios extra
        legal_name: data.legal_name.trim(),
        country_of_origin: data.country_of_origin.trim(),
        main_office: data.main_office.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        state: data.state.trim(),
      };

      if (editingAirline) {
        // Si editamos, se actualiza
        const updatedAirline = await updateAirline(
          editingAirline._id,
          transformedData
        );
        if (updatedAirline) {
          setEditingAirline(null);
        }
      } else {
        await createAirline(transformedData);
      }
      reset(); // limpiamos formulario
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log("ID a eliminar:", id); // Para verificar específicamente el ID

    try {
      await deleteAirline(id); // Elimina del servidor
    } catch (error) {
      console.error("Error al eliminar la aerolínea:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingAirline(item);
    Object.keys(item).forEach((key) => {
      if (
        key !== "_id" &&
        key !== "createdAt" &&
        key !== "updatedAt" &&
        key !== "__v"
      ) {
        setValue(key, item[key]);
      }
    });
  };

  // Función para manejar la búsqueda
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    const results = await searchAirlines(term); // Llama a la función del contexto
    setSearchResults(results); // Actualiza el estado con los resultados
  };

  // Filtrar las aerolíneas según el término de búsqueda
  const filteredAirlines = searchTerm ? searchResults : airlines; // Usa resultados de búsqueda si hay término

  return (
    <>
      <form onSubmit={handleSubmit(FormSubmit)} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 text-[1.1rem] font-medium text-gray-400">
          <div>
            <label htmlFor="name" className="block mb-1">
              Nombre Aerolinea
            </label>
            <input
              type="text"
              {...register("name", {
                minLength: {
                  value: 5,
                  message: "Deber tener minimo 5 caracteres",
                },
                required: {
                  value: true,
                  message: "El nombre de la aerolinea es obligatorio",
                },
                maxLength: {
                  value: 30,
                  message: "El nombre no puede exceder los 30 caracteres",
                },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/,
                  message: "Solo se permiten letras, espacios y puntos",
                },
              })}
              className="w-full border px-2 py-1"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="legal_name" className="block mb-1">
              Nombre Legal
            </label>
            <input
              type="text"
              {...register("legal_name", {
                required: "El nombre legal de la aerolinea es obligatorio",
                maxLength: {
                  value: 50,
                  message: "El nombre legal no puede exceder los 30 caracteres",
                },
                minLength: {
                  value: 5,
                  message: "Deber tener minimo 5 caracteres",
                },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/,
                  message: "Solo se permiten letras y espacios",
                },
              })}
              className="w-full border px-2 py-1"
            />
            {errors.legal_name && (
              <span className="text-red-500">{errors.legal_name.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="state" className="block mb-1">
              Estado Aerolinea
            </label>
            <select
              {...register("state", {
                required: "Debes seleccionar una opción",
              })}
              className="w-full border  px-2 py-1"
            >
              <option value="">Seleccione estado actual:</option>
              <option value="activa">Activa</option>
              <option value="suspendida">Suspendida</option>
              <option value="inactiva">Inactiva</option>
            </select>
            {errors.state && (
              <span className="text-red-500">{errors.state.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="country_of_origin" className="block mb-1">
              País Origen
            </label>
            <input
              type="text"
              {...register("country_of_origin", {
                required: {
                  value: "true",
                  message: "País es requerido",
                },
                maxLength: {
                  value: 30,
                  message:
                    "El nombre del pais no puede exceder los 30 caracteres",
                },
                minLength: {
                  value: 5,
                  message: "Deber tener minimo 5 caracteres",
                },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo se permiten letras y espacios",
                },
              })}
              className="w-full border  px-2 py-1"
            />
            {errors.country_of_origin && (
              <span className="text-red-500">
                {errors.country_of_origin.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="number_of_employees" className="block mb-1">
              Número de empleados
            </label>
            <input
              type="number"
              {...register("number_of_employees", {
                required: {
                  value: "true",
                  message: "Ingrese un valor númerico",
                },
              })}
              className="w-full border  px-2 py-1"
            />
            {errors.number_of_employees && (
              <span className="text-red-500">
                {errors.number_of_employees.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="main_office" className="block mb-1">
              Sede Principal
            </label>
            <input
              type="text"
              {...register("main_office", {
                required: {
                  value: "true",
                  message: "Sede principal es obligatorio",
                },
                minLength: {
                  value: 5,
                  message: "Deber tener minimo 5 caracteres",
                },
                maxLength: {
                  value: 30,
                  message:
                    "El nombre de la sede principal no puede exceder los 30 caracteres",
                },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo se permiten letras y espacios",
                },
              })}
              className="w-full border  px-2 py-1"
            />
            {errors.main_office && (
              <span className="text-red-500">{errors.main_office.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1">
              Telefono
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: {
                  value: true,
                  message: "Télefono es obligatorio",
                },
                pattern: {
                  value: /^[0-9+\- ]+$/,
                  message: "Ingrese solo numeros",
                },
              })}
              className="w-full border  px-2 py-1"
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Correo Electronico
            </label>
            <input
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Correo es requerido",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Ingrese un correo valido",
                },
              })}
              className="w-full border  px-2 py-1"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="number_of_airplanes" className="block mb-1">
              Cantidad de aviones
            </label>
            <input
              type="number"
              {...register("number_of_airplanes", {
                required: {
                  value: true,
                  message: "Ingrese la cantidad",
                },
              })}
              className="w-full border  px-2 py-1"
            />
            {errors.number_of_airplanes && (
              <span className="text-red-500">
                {errors.number_of_airplanes.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="hover:bg-cyan-800 bg-cyan-600 hover: text-white w-[30rem] col-span-3 mx-auto px-4 py-2 rounded-md"
          >
            {loading
              ? "Guardando..."
              : editingAirline
              ? "Actualizar Aerolínea"
              : "Agregar Aerolínea"}
          </button>
        </div>
      </form>

      {/* Campo de búsqueda */}
      <div className="mb-4 flex flex-col gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar aerolínea..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
          className="border text-2xl mt-6 px-2 py-2 w-96"
        />
        <button
          type="button"
          onClick={() => handleSearch(searchTerm)} // Ejecuta la búsqueda al hacer clic
          className="ml-2 bg-cyan-600 w-96 text-white px-4 py-2 text-2xl rounded-md hover:bg-cyan-800"
        >
          Buscar
        </button>
      </div>

      <div className="mx-auto mt-10 sm:w-full">
        <DataTable
          data={airlines}
          headers={[
            { key: "name", label: "Nombre" },
            { key: "legal_name", label: "Nombre Legal" },
            { key: "country_of_origin", label: "País de Origen" },
            { key: "state", label: "Estado" },
            { key: "number_of_employees", label: "Empleados" },
            { key: "main_office", label: "Sede Principal" },
            { key: "phone", label: "Teléfono" },
            { key: "email", label: "Correo" },
            { key: "number_of_airplanes", label: "Aviones" },
          ]}
          idField="_id"
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </>
  );
}
