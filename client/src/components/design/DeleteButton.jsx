import { useState } from "react";

export default function DeleteButton ({ item, idField, onDelete }) {
    const [modalOpen, setModalOpen] = useState(false); // Controla el modal
    const [successModal, setSuccessModal] = useState(false); // Mensaje de éxito
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const id = item[idField];
      if (!id) {
        throw new Error(`${idField} no válido: ${id}`);
      }
      
      await onDelete(id);
      setModalOpen(false);
      setSuccessModal(true);
      setTimeout(() => setSuccessModal(false), 3000);
    } catch (error) {
      setError(error.message || 'Error al eliminar el registro');
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
          className="bg-red-500 hover:bg-red-800 text-white font-bold py-1 px-2 rounded"
        >
          {isLoading ? 'Eliminando...' : ' Eliminar'}
        </button>
  
        {/* Modal de confirmación */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-slate-900 p-6 rounded-md w-96 text-center">
              <h2 className="text-lg font-semibold mb-4 text-white">
                ¿Estás seguro de eliminar este registro?
              </h2>
              <p className="mb-4 text-gray-300">
                Esta acción no se puede deshacer.
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
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
                >
                  {isLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
                {error && (
                  <p className="mt-4 text-red-500">{error}</p>
                )}
            </div>
          </div>
        )}
        {/* Modal de éxito */}
        {successModal &&(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-green-500 text-white p-4 rounded-md w-96 text-center">
              <h2 className="text-lg font-semibold">Registro eliminado</h2>
              <p>El registro ha sido eliminado exitosamente.</p>
            </div>
          </div>
        )}
      </>
    );
  };