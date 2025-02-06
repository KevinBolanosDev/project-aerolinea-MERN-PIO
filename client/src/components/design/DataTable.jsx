import React from "react";

export default function DataTable({
  data,
  headers,
  idField = "_id",
  onDelete,
  onEdit,
  onDownload,
}) {
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className="overflow-x-auto bg-slate-900 scrollbar-none h-[31rem]">
      <table className="min-w-full bg-slate-900">
        <thead>
          <tr className="bg-slate-500 border-2 uppercase text-sm leading-normal">
            {headers.map((header, id) => (
              <th key={id} className="py-3 px-6 text-left">
                {header.label}
              </th>
            ))}
            {/* columna de acciones */}
            {(onDelete || onEdit) && (
              <th className="py-3 px-16 text-left">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="hover:text-neutral-300 text-white text-sm font-light">
          {data.map((row) => (
            <tr
              key={row[idField]}
              className="border-2 border-gray-200 hover:bg-slate-800"
            >
              {headers.map((header, cellIndex) => (
                <td
                  key={cellIndex}
                  className="py-3 px-6 text-left whitespace-nowrap"
                >
                  {getNestedValue(row, header.key)}
                </td>
              ))}
              {/* Celda de acciones */}
              <td className="py-3 px-6 text-left flex flex-row space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="bg-blue-900 text-white px-2 py-2 rounded hover:bg-blue-600"
                  >
                    <img className="w-6" src="/edit.svg" alt="Boton editar" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row[idField])}
                    className="bg-red-900 text-white px-2 py-2 rounded hover:bg-red-500"
                  >
                    <img className="w-6" src="/delete.svg" alt="Boton eliminar" />
                  </button>
                )}
                {onDownload && ( // ✅ Nuevo botón de descarga
                  <button
                    onClick={() => onDownload(row[idField])}
                    className="bg-green-900 text-white px-2 py-2 rounded hover:bg-green-500"
                  >
                    <img className="w-6" src="/download.svg" alt="Boton descargar" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center text-white py-4">
          No hay registros para mostrar
        </div>
      )}
    </div>
  );
}
