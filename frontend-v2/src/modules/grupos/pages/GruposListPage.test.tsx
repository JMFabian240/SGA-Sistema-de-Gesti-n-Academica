import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GruposListPage } from './GruposListPage';
import { MemoryRouter } from 'react-router-dom';

// Mock de iconos
vi.mock('lucide-react', () => ({
  Users: () => <span data-testid="users-icon" />,
  BookOpen: () => <span data-testid="book-open-icon" />,
  Plus: () => <span data-testid="plus-icon" />,
  ArrowLeft: () => <span data-testid="arrow-left-icon" />,
  Calendar: () => <span data-testid="calendar-icon" />,
  Layers: () => <span data-testid="layers-icon" />,
  Trash2: () => <span data-testid="trash-icon" />,
  LayoutGrid: () => <span data-testid="layout-grid-icon" />
}));

// Mock de modales
vi.mock('../components/GrupoFormModal', () => ({
  GrupoFormModal: ({ isOpen, onClose }: any) => isOpen ? (
    <div data-testid="grupo-form-modal">
      <button onClick={onClose}>Cerrar Modal</button>
    </div>
  ) : null
}));

vi.mock('../components/AsignarMateriaModal', () => ({
  AsignarMateriaModal: ({ isOpen, onClose }: any) => isOpen ? (
    <div data-testid="asignar-materia-modal">
      <button onClick={onClose}>Cerrar Modal</button>
    </div>
  ) : null
}));

// Mock de tRPC
const mockGetCiclos = vi.fn();
const mockGetNiveles = vi.fn();
const mockGetGrados = vi.fn();
const mockGetMaterias = vi.fn();
const mockGetGrupos = vi.fn();
const mockGetInscripciones = vi.fn();

vi.mock('../../../lib/trpc', () => {
  return {
    trpc: {
      useUtils: () => ({
        grupos: { getMaterias: { invalidate: vi.fn() }, getGrupos: { invalidate: vi.fn() } },
        inscripciones: { getInscripciones: { invalidate: vi.fn() } }
      }),
      grupos: {
        getCiclos: { useQuery: () => mockGetCiclos() },
        getNiveles: { useQuery: () => mockGetNiveles() },
        getGrados: { useQuery: () => mockGetGrados() },
        getMaterias: { useQuery: () => mockGetMaterias() },
        getGrupos: { useQuery: () => mockGetGrupos() },
        updateMateria: { useMutation: () => ({ mutate: vi.fn() }) },
        deleteGrupo: { useMutation: () => ({ mutate: vi.fn() }) }
      },
      inscripciones: {
        getInscripciones: { useQuery: () => mockGetInscripciones() }
      }
    }
  };
});

describe('GruposListPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCiclos.mockReturnValue({ data: [{ cicloId: 1, activo: true, periodicidad: 'ANUAL' }] });
    mockGetNiveles.mockReturnValue({ data: [{ nivelId: 1, nombre: 'Primaria', codigo: 'PRI' }] });
    mockGetGrados.mockReturnValue({ data: [{ gradoId: 1, numero: 1, nombre: 'Primero', nivelId: 1 }] });
    mockGetMaterias.mockReturnValue({ data: [] });
    mockGetGrupos.mockReturnValue({ data: [] });
    mockGetInscripciones.mockReturnValue({ data: [], isLoading: false });
  });

  it('debería renderizar la vista de malla curricular (Niveles y Grados) por defecto', () => {
    render(
      <MemoryRouter>
        <GruposListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Grados Académicos')).toBeInTheDocument();
    expect(screen.getByText('Primaria')).toBeInTheDocument();
    expect(screen.getByText('Primero')).toBeInTheDocument();
  });

  it('debería cambiar a la vista detallada al hacer clic en un grado', () => {
    render(
      <MemoryRouter>
        <GruposListPage />
      </MemoryRouter>
    );

    const gradoCard = screen.getByText('Primero');
    fireEvent.click(gradoCard);

    // In detail view, we have h1 "Primero" and p "Primaria"
    expect(screen.getAllByText('Primero').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /agregar grupo/i })).toBeInTheDocument();
  });

  it('debería abrir el modal para agregar sección en la vista detallada', () => {
    render(
      <MemoryRouter>
        <GruposListPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Primero')); // Entrar a vista detallada

    const btnNuevaSeccion = screen.getByRole('button', { name: /agregar grupo/i });
    fireEvent.click(btnNuevaSeccion);

    expect(screen.getByTestId('grupo-form-modal')).toBeInTheDocument();
  });

  it('debería regresar a la malla al dar click en el botón Volver', () => {
    render(
      <MemoryRouter>
        <GruposListPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Primero')); // Entrar
    expect(screen.getAllByText('Primero').length).toBeGreaterThan(0);

    const btnVolver = screen.getByTestId('arrow-left-icon').closest('button');
    if (btnVolver) fireEvent.click(btnVolver);

    expect(screen.getByText('Grados Académicos')).toBeInTheDocument();
  });
});
