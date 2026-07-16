import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TutoresPage } from './TutoresPage';
import { BrowserRouter } from 'react-router-dom';

// Mocks de navegación y iconos
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon" />,
  Search: () => <span data-testid="search-icon" />,
  Download: () => <span data-testid="download-icon" />,
  Edit2: () => <span data-testid="edit-icon" />,
  Trash2: () => <span data-testid="trash-icon" />
}));

// Mock de tRPC
const mockGetAllQuery = vi.fn();

vi.mock('../../../lib/trpc', () => {
  return {
    trpc: {
      useUtils: () => ({}),
      tutores: {
        getAll: {
          useQuery: () => mockGetAllQuery()
        },
        delete: {
          useMutation: () => ({ mutate: vi.fn(), isPending: false })
        }
      }
    }
  };
});

describe('TutoresPage Component', () => {
  const mockTutores = [
    {
      tutorId: 1,
      nombreCompleto: 'Roberto Diaz Gomez',
      telefono: '5551234567',
      correoElectronico: 'roberto@example.com'
    },
    {
      tutorId: 2,
      nombreCompleto: 'Maria Herrera Castillo',
      telefono: '5559876543',
      correoElectronico: 'maria@example.com'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el estado de cargando', () => {
    mockGetAllQuery.mockReturnValue({ isLoading: true, data: undefined });

    render(
      <BrowserRouter>
        <TutoresPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Cargando directorio de padres...')).toBeInTheDocument();
  });

  it('debería renderizar la lista de tutores cuando se cargan los datos', () => {
    mockGetAllQuery.mockReturnValue({ isLoading: false, data: mockTutores });

    render(
      <BrowserRouter>
        <TutoresPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Roberto Diaz Gomez')).toBeInTheDocument();
    expect(screen.getByText('Maria Herrera Castillo')).toBeInTheDocument();
    expect(screen.getByText('roberto@example.com')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
  });

  it('debería navegar a la página de detalles al hacer click en una fila', () => {
    mockGetAllQuery.mockReturnValue({ isLoading: false, data: [mockTutores[0]] });

    render(
      <BrowserRouter>
        <TutoresPage />
      </BrowserRouter>
    );

    const btn = screen.getAllByText('Ver Info')[0];
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith('/tutores/1');
  });
});
