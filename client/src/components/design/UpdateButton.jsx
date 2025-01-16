import { useState } from "react";

export default function UpdateButton({ item, onEdit }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!item) {
        throw new Error("No hay datos para actualizar");
      }

      const result = await onEdit(item);
      if (result) {
        setModalOpen(false);
        setSuccessModal(true);
        setTimeout(() => setSuccessModal(false), 3000);
      }
    } catch (error) {
      setError(error.message || "Error al actualizar el registro");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón principal para abrir el modal */}
      <button
        onClick={() => setModalOpen(true)}
        disabled={isLoading}
        className="bg-cyan-600 hover:bg-cyan-800 text-white font-bold py-1 px-2 rounded mr-2"
      >
        {isLoading ? 'Actualizando...' : 'Editar'}
      </button>

      {/* Modal de actualización */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-900 p-6 rounded-md w-96 text-center">
            <h2 className="text-lg font-semibold mb-4 text-white">
              ¿Deseas actualizar este registro?
            </h2>
            <p className="mb-4 text-gray-300">
              Confirma para continuar con la actualización.
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setModalOpen(false)}
                disabled={isLoading}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
              >
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
              {error && (
              <p className="mt-4 text-red-500">{error}</p>
            )}
            </div>
          </div>
        </div>
      )}

          {/* Modal de éxito Nota: pendiente revisar el modal de confirmación */}
          {successModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white p-4 rounded-md w-96 text-center">
            <h2 className="text-lg font-semibold">
              Registro actualizado exitosamente
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
