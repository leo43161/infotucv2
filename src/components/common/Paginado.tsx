'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils'; // Asegúrate que la ruta a tu utilidad cn es correcta

// 1. Definimos la interfaz para las props del componente
interface PaginadoProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  accentColor?: string;
}

const Paginado = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  accentColor = 'var(--primary)', // Color por defecto si no se provee
}: PaginadoProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // No mostrar paginación si solo hay una página o menos
  /* if (totalPages <= 1) {
    return <div></div>;
  } */

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generación del array de páginas a mostrar con lógica de elipsis
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5; // Máximo de botones numéricos a mostrar

    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar elipsis cuando hay muchas páginas
      if (currentPage <= 3) {
        // Caso: cerca del inicio (1, 2, 3, 4, ..., 10)
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Caso: cerca del final (1, ..., 7, 8, 9, 10)
        pages.push(1, '...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Caso: en el medio (1, ..., 4, 5, 6, ..., 10)
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-5", className || '')}>
      {/* Botón Anterior */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          'p-1 rounded-md transition-colors bg-secondary text-zinc-50',
          currentPage === 1
            ? 'text-zinc-700 cursor-not-allowed bg-gray-400'
            : 'text-zinc-100 hover:bg-gray-600'
        )}
        aria-label="Página anterior"
      >
        <ChevronLeft size={35} />
      </button>
      <div className='flex gap-2 items-center'>

        {/* Números de Página */}
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={index} className="px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              style={currentPage === page ? { backgroundColor: accentColor, color: 'white' } : {}}
              className={cn(
                'px-3 py-1 text-2xl font-semibold rounded transition-colors flex justify-center items-center',
                currentPage !== page && 'text-gray-700 hover:bg-secondary hover:text-zinc-50' || ''
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          'p-1 rounded-md transition-colors bg-secondary text-zinc-50',
          currentPage === totalPages
            ? 'text-zinc-700 cursor-not-allowed bg-gray-400'
            : 'text-zinc-100 hover:bg-gray-600'
        )}
        aria-label="Página siguiente"
      >
        <ChevronRight size={35} />
      </button>
    </div>
  );  
};

export default Paginado;