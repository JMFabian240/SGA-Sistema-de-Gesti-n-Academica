import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfiguracionPage } from './ConfiguracionPage';

// Mock de iconos
vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon" />,
  Edit2: () => <span data-testid="edit-icon" />,
  Trash2: () => <span data-testid="trash-icon" />,
  Calendar: () => <span data-testid="calendar-icon" />,
  DollarSign: () => <span data-testid="dollar-icon" />,
  RefreshCw: () => <span data-testid="refresh-icon" />,
  AlertTriangle: () => <span data-testid="alert-icon" />,
  Check: () => <span data-testid="check-icon" />,
  Info: () => <span data-testid="info-icon" />,
  CheckCircle: () => <span data-testid="check-circle-icon" />,
}));

// Mock del modal hijo
vi.mock('../components/CicloFormModal', () => ({
  CicloFormModal: ({ isOpen, onClose }: any) => isOpen ? (
    <div data-testid="ciclo-modal">
      <button onClick={onClose}>Cerrar Modal</button>
    </div>
  ) : null
}));

// Mock de tRPC
const mockGetCiclos = vi.fn();
const mockGetNiveles = vi.fn();
const mockGetTarifas = vi.fn();
const mockGetGrupos = vi.fn();
const mockGetAlumnosCierreGrupo = vi.fn();

vi.mock('../../../lib/trpc', () => {
  return {
    trpc: {
      useContext: () => ({
        grupos: { getCiclos: { invalidate: vi.fn() } },
        pagos: { getTarifas: { invalidate: vi.fn() } },
      }),
      grupos: {
        getCiclos: { useQuery: () => mockGetCiclos() },
        getNiveles: { useQuery: () => mockGetNiveles() },
        getGrupos: { useQuery: () => mockGetGrupos() },
        getAlumnosCierreGrupo: { useQuery: () => mockGetAlumnosCierreGrupo() },
        deleteCiclo: { useMutation: () => ({ mutate: vi.fn() }) },
        cerrarCicloGrupo: { useMutation: () => ({ mutate: vi.fn() }) },
      },
      pagos: {
        getTarifas: { useQuery: () => mockGetTarifas() },
        createTarifa: { useMutation: () => ({ mutateAsync: vi.fn() }) },
        updateTarifa: { useMutation: () => ({ mutateAsync: vi.fn() }) },
      }
    }
  };
});

describe('ConfiguracionPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCiclos.mockReturnValue({ isLoading: false, data: [] });
    mockGetNiveles.mockReturnValue({ isLoading: false, data: [] });
    mockGetTarifas.mockReturnValue({ isLoading: false, data: [] });
    mockGetGrupos.mockReturnValue({ isLoading: false, data: [] });
    mockGetAlumnosCierreGrupo.mockReturnValue({ isLoading: false, data: [] });
  });

  it('debería renderizar la pestaña de Ciclos Escolares por defecto', () => {
    render(<ConfiguracionPage />);
    expect(screen.getByText('Configuración General')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nuevo ciclo/i })).toBeInTheDocument();
    expect(screen.getByText('No hay ciclos escolares registrados. Crea uno nuevo.')).toBeInTheDocument();
  });

  it('debería cambiar a la pestaña de Finanzas y Tarifas al hacer click', () => {
    render(<ConfiguracionPage />);

    const finanzasTab = screen.getByRole('button', { name: /finanzas y tarifas/i });
    fireEvent.click(finanzasTab);

    expect(screen.getByText('Tarifas por Nivel Educativo')).toBeInTheDocument();
    expect(screen.getByText('Tarifas de Bachillerato')).toBeInTheDocument();
  });

  it('debería cambiar a la pestaña de Operaciones de Ciclo al hacer click', () => {
    render(<ConfiguracionPage />);

    const operacionesTab = screen.getByRole('button', { name: /operaciones de ciclo/i });
    fireEvent.click(operacionesTab);

    expect(screen.getByText('Cierre de Ciclo por Grupos')).toBeInTheDocument();
  });

  it('debería mostrar el loader mientras cargan los ciclos', () => {
    mockGetCiclos.mockReturnValue({ isLoading: true, data: undefined });
    render(<ConfiguracionPage />);
    expect(screen.getByText('Cargando ciclos escolares...')).toBeInTheDocument();
  });

  it('debería abrir el modal de Nuevo Ciclo al dar click en el botón', () => {
    render(<ConfiguracionPage />);

    const btnNuevo = screen.getByRole('button', { name: /nuevo ciclo/i });
    fireEvent.click(btnNuevo);

    expect(screen.getByTestId('ciclo-modal')).toBeInTheDocument();
  });
});
