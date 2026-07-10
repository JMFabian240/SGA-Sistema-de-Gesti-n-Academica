<<<<<<< HEAD
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GruposListPage } from './GruposListPage';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('lucide-react', () => ({
  Users: () => React.createElement('div', { 'data-testid': 'icon-users' }),
  BookOpen: () => React.createElement('div', { 'data-testid': 'icon-book' }),
  Plus: () => React.createElement('div', { 'data-testid': 'icon-plus' }),
  ArrowLeft: () => React.createElement('div', { 'data-testid': 'icon-arrow-left' }),
  Calendar: () => React.createElement('div', { 'data-testid': 'icon-calendar' }),
  Layers: () => React.createElement('div', { 'data-testid': 'icon-layers' }),
  Trash2: () => React.createElement('div', { 'data-testid': 'icon-trash2' }),
  LayoutGrid: () => React.createElement('div', { 'data-testid': 'icon-layout-grid' }),
}));

// Mocks de modales
vi.mock('../components/GrupoFormModal', () => ({
  GrupoFormModal: ({ isOpen }: any) => {
    if (!isOpen) return null;
    return React.createElement('div', { 'data-testid': 'grupo-modal' }, 'Modal de Grupo');
  }
}));

vi.mock('../components/AsignarMateriaModal', () => ({
  AsignarMateriaModal: ({ isOpen }: any) => {
    if (!isOpen) return null;
    return React.createElement('div', { 'data-testid': 'asignar-materia-modal' }, 'Modal de Asignar Materia');
  }
}));

const mockConfirm = vi.fn();
window.confirm = mockConfirm;

// Mocks de tRPC
=======
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
>>>>>>> 8cb2fafe5b5ad39e1ed63c80e52ee04146f25379
const mockGetCiclos = vi.fn();
const mockGetNiveles = vi.fn();
const mockGetGrados = vi.fn();
const mockGetMaterias = vi.fn();
const mockGetGrupos = vi.fn();
const mockGetInscripciones = vi.fn();
<<<<<<< HEAD
const mockDeleteGrupo = vi.fn();
const mockUpdateMateria = vi.fn();
=======
>>>>>>> 8cb2fafe5b5ad39e1ed63c80e52ee04146f25379

vi.mock('../../../lib/trpc', () => {
  return {
    trpc: {
      useUtils: () => ({
<<<<<<< HEAD
        grupos: { 
          getGrupos: { invalidate: vi.fn() },
          getMaterias: { invalidate: vi.fn() }
        },
=======
        grupos: { getMaterias: { invalidate: vi.fn() }, getGrupos: { invalidate: vi.fn() } },
>>>>>>> 8cb2fafe5b5ad39e1ed63c80e52ee04146f25379
        inscripciones: { getInscripciones: { invalidate: vi.fn() } }
      }),
      grupos: {
        getCiclos: { useQuery: () => mockGetCiclos() },
        getNiveles: { useQuery: () => mockGetNiveles() },
        getGrados: { useQuery: () => mockGetGrados() },
        getMaterias: { useQuery: () => mockGetMaterias() },
        getGrupos: { useQuery: () => mockGetGrupos() },
<<<<<<< HEAD
        deleteGrupo: { useMutation: () => ({ mutate: mockDeleteGrupo }) },
        updateMateria: { useMutation: () => ({ mutate: mockUpdateMateria }) }
=======
        updateMateria: { useMutation: () => ({ mutate: vi.fn() }) },
        deleteGrupo: { useMutation: () => ({ mutate: vi.fn() }) }
>>>>>>> 8cb2fafe5b5ad39e1ed63c80e52ee04146f25379
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
<<<<<<< HEAD
    
    mockGetCiclos.mockReturnValue({
      data: [{ cicloId: 1, nombre: '2024-2025', activo: true, periodicidad: 'ANUAL' }]
    });

    mockGetNiveles.mockReturnValue({
      data: [{ nivelId: 1, nombre: 'Primaria', codigo: 'PRI' }]
    });

    mockGetGrados.mockReturnValue({
      data: [{ gradoId: 1, nivelId: 1, nombre: 'Primer Grado', numero: 1 }]
    });

    mockGetMaterias.mockReturnValue({
      data: []
    });

    mockGetGrupos.mockReturnValue({
      data: [{ grupoId: 1, gradoId: 1, cicloId: 1, nombre: '1A', cupoMaximo: 30, estado: 'ACTIVO' }]
    });

    mockGetInscripciones.mockReturnValue({
      data: [], isLoading: false
    });
  });

  it('debería renderizar la lista de grados y niveles', () => {
    render(
      <BrowserRouter>
        <GruposListPage />
      </BrowserRouter>
=======
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
>>>>>>> 8cb2fafe5b5ad39e1ed63c80e52ee04146f25379
    );

    expect(screen.getByText('Grados Académicos')).toBeInTheDocument();
    expect(screen.getByText('Primaria')).toBeInTheDocument();
<<<<<<< HEAD
    expect(screen.getByText('Primer Grado')).toBeInTheDocument();
  });

  it('debería mostrar los grupos y materias al seleccionar un grado', async () => {
    render(
      <BrowserRouter>
        <GruposListPage />
      </BrowserRouter>
    );

    // Clic en el grado "Primer Grado"
    const btnDetalles = screen.getByText('Primer Grado');
    fireEvent.click(btnDetalles);

    // Verificar si el select tiene "Grupo 1A" (ya que seccionesDisponibles renderiza Grupo 1A)
    await waitFor(() => {
      expect(screen.getByText('Grupo 1A')).toBeInTheDocument();
    });
  });

=======
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
>>>>>>> 8cb2fafe5b5ad39e1ed63c80e52ee04146f25379
});
