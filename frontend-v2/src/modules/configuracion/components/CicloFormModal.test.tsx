import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CicloFormModal } from './CicloFormModal';

// Mock del componente Modal
vi.mock('../../../components/ui/Modal', () => ({
  Modal: ({ isOpen, children, title }: any) => isOpen ? (
    <div data-testid="mock-modal">
      <h1>{title}</h1>
      {children}
    </div>
  ) : null
}));

// Mock de tRPC
const mockInvalidate = vi.fn();
const mockCreateMutate = vi.fn();
const mockUpdateMutate = vi.fn();
let mockOnError: any = null;

vi.mock('../../../lib/trpc', () => {
  return {
    trpc: {
      useContext: () => ({
        grupos: {
          getCiclos: {
            invalidate: mockInvalidate
          }
        }
      }),
      grupos: {
        createCiclo: {
          useMutation: (options?: any) => ({
            mutate: (payload: any) => {
              mockCreateMutate(payload);
              if (mockOnError && options?.onError) {
                options.onError({ message: 'Error de servidor' });
              } else if (options?.onSuccess) {
                options.onSuccess();
              }
            },
            isLoading: false
          })
        },
        updateCiclo: {
          useMutation: (options?: any) => ({
            mutate: (payload: any) => {
              mockUpdateMutate(payload);
              if (mockOnError && options?.onError) {
                options.onError({ message: 'Error al actualizar' });
              } else if (options?.onSuccess) {
                options.onSuccess();
              }
            },
            isLoading: false
          })
        }
      }
    }
  };
});

describe('CicloFormModal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnError = null;
  });

  it('no debería renderizar nada si isOpen es false', () => {
    const { container } = render(
      <CicloFormModal isOpen={false} onClose={mockOnClose} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('debería renderizar el formulario vacío para Nuevo Ciclo', () => {
    render(
      <CicloFormModal isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('Nuevo Ciclo Escolar')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del ciclo/i)).toHaveValue('');
    expect(screen.getByLabelText(/fecha de inicio/i)).toHaveValue('');
    expect(screen.getByLabelText(/fecha de fin/i)).toHaveValue('');
    expect(screen.getByLabelText(/marcar como ciclo escolar activo/i)).not.toBeChecked();
  });

  it('debería renderizar datos precargados en modo edición', () => {
    const initialData = {
      nombre: '2026-2027',
      fechaInicio: '2026-09-01',
      fechaFin: '2027-06-30',
      activo: true,
      periodicidad: 'SEMESTRAL' as const
    };

    render(
      <CicloFormModal isOpen={true} onClose={mockOnClose} cicloId={123} initialData={initialData} />
    );

    expect(screen.getByText('Editar Ciclo Escolar')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del ciclo/i)).toHaveValue('2026-2027');
    expect(screen.getByLabelText(/fecha de inicio/i)).toHaveValue('2026-09-01');
    expect(screen.getByLabelText(/fecha de fin/i)).toHaveValue('2027-06-30');
    expect(screen.getByLabelText(/marcar como ciclo escolar activo/i)).toBeChecked();
    expect(screen.getByRole('combobox')).toHaveValue('SEMESTRAL');
  });

  it('debería ejecutar createMutation al enviar datos válidos en creación', () => {
    render(
      <CicloFormModal isOpen={true} onClose={mockOnClose} />
    );

    const nameInput = screen.getByLabelText(/nombre del ciclo/i);
    const startInput = screen.getByLabelText(/fecha de inicio/i);
    const endInput = screen.getByLabelText(/fecha de fin/i);
    const checkbox = screen.getByLabelText(/marcar como ciclo escolar activo/i);
    const submitBtn = screen.getByRole('button', { name: /guardar ciclo/i });

    fireEvent.change(nameInput, { target: { value: '2026-2027' } });
    fireEvent.change(startInput, { target: { value: '2026-09-01' } });
    fireEvent.change(endInput, { target: { value: '2027-06-30' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitBtn);

    expect(mockCreateMutate).toHaveBeenCalledWith({
      nombre: '2026-2027',
      fechaInicio: new Date('2026-09-01').toISOString(),
      fechaFin: new Date('2027-06-30').toISOString(),
      activo: true,
      periodicidad: 'ANUAL'
    });
    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('debería ejecutar updateMutation al enviar en edición', () => {
    const initialData = {
      nombre: '2026-2027',
      fechaInicio: '2026-09-01',
      fechaFin: '2027-06-30',
      activo: false,
      periodicidad: 'ANUAL' as const
    };

    render(
      <CicloFormModal isOpen={true} onClose={mockOnClose} cicloId={99} initialData={initialData} />
    );

    const submitBtn = screen.getByRole('button', { name: /guardar ciclo/i });
    fireEvent.click(submitBtn);

    expect(mockUpdateMutate).toHaveBeenCalledWith({
      cicloId: 99,
      nombre: '2026-2027',
      fechaInicio: new Date('2026-09-01').toISOString(),
      fechaFin: new Date('2027-06-30').toISOString(),
      activo: false,
      periodicidad: 'ANUAL'
    });
    expect(mockInvalidate).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('debería mostrar banner de error cuando la mutación tRPC falla', () => {
    mockOnError = true; // Forzar error
    render(
      <CicloFormModal isOpen={true} onClose={mockOnClose} />
    );

    const nameInput = screen.getByLabelText(/nombre del ciclo/i);
    const startInput = screen.getByLabelText(/fecha de inicio/i);
    const endInput = screen.getByLabelText(/fecha de fin/i);
    const submitBtn = screen.getByRole('button', { name: /guardar ciclo/i });

    fireEvent.change(nameInput, { target: { value: '2026-2027' } });
    fireEvent.change(startInput, { target: { value: '2026-09-01' } });
    fireEvent.change(endInput, { target: { value: '2027-06-30' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Error de servidor')).toBeInTheDocument();
  });
});
