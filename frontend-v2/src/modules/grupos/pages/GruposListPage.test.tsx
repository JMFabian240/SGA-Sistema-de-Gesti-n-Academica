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
const mockGetCiclos = vi.fn();
const mockGetNiveles = vi.fn();
const mockGetGrados = vi.fn();
const mockGetMaterias = vi.fn();
const mockGetGrupos = vi.fn();
const mockGetInscripciones = vi.fn();
const mockDeleteGrupo = vi.fn();
const mockUpdateMateria = vi.fn();

vi.mock('../../../lib/trpc', () => {
  return {
    trpc: {
      useUtils: () => ({
        grupos: { 
          getGrupos: { invalidate: vi.fn() },
          getMaterias: { invalidate: vi.fn() }
        },
        inscripciones: { getInscripciones: { invalidate: vi.fn() } }
      }),
      grupos: {
        getCiclos: { useQuery: () => mockGetCiclos() },
        getNiveles: { useQuery: () => mockGetNiveles() },
        getGrados: { useQuery: () => mockGetGrados() },
        getMaterias: { useQuery: () => mockGetMaterias() },
        getGrupos: { useQuery: () => mockGetGrupos() },
        deleteGrupo: { useMutation: () => ({ mutate: mockDeleteGrupo }) },
        updateMateria: { useMutation: () => ({ mutate: mockUpdateMateria }) }
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
    );

    expect(screen.getByText('Grados Académicos')).toBeInTheDocument();
    expect(screen.getByText('Primaria')).toBeInTheDocument();
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

});
