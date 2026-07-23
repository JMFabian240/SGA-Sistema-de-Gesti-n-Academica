import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NuevoCargoModal } from './NuevoCargoModal';

// Mocks
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x" />,
  Save: () => <span data-testid="icon-save" />,
  PlusCircle: () => <span data-testid="icon-plus" />,
}));

const mockCreateCargo = vi.fn();
const mockInvalidateAdeudos = vi.fn();

vi.mock('../../../lib/trpc', () => ({
  trpc: {
    useUtils: () => ({
      pagos: {
        getAdeudos: { invalidate: mockInvalidateAdeudos },
      }
    }),
    pagos: {
      createCargoExtraordinario: {
        useMutation: (options: any) => ({
          mutate: (data: any) => {
            mockCreateCargo(data);
            if (options?.onSuccess) {
              options.onSuccess();
            }
          },
          isPending: false,
        })
      }
    }
  }
}));

describe('NuevoCargoModal Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no debe renderizar nada si isOpen es false', () => {
    const { container } = render(
      <NuevoCargoModal isOpen={false} onClose={onClose} alumnoId={1} cicloId={1} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('debe renderizar correctamente cuando isOpen es true', () => {
    render(
      <NuevoCargoModal isOpen={true} onClose={onClose} alumnoId={1} cicloId={1} />
    );
    expect(screen.getByText('Cargo Extraordinario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej. Libro de Inglés/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej. 1500 o 1500.00/i)).toBeInTheDocument();
  });

  it('debe mostrar error y no llamar a la API si se envía vacío', () => {
    render(
      <NuevoCargoModal isOpen={true} onClose={onClose} alumnoId={1} cicloId={1} />
    );

    const submitBtn = screen.getByRole('button', { name: /Generar Cargo/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Todos los campos son obligatorios y el monto debe ser mayor a 0.')).toBeInTheDocument();
    expect(mockCreateCargo).not.toHaveBeenCalled();
  });

  it('debe limpiar entrada no numérica del monto', () => {
    render(
      <NuevoCargoModal isOpen={true} onClose={onClose} alumnoId={1} cicloId={1} />
    );

    const inputMonto = screen.getByPlaceholderText(/Ej. 1500/i) as HTMLInputElement;
    fireEvent.change(inputMonto, { target: { value: '150a0.50' } });

    // El onchange reemplaza /[^0-9.]/g y evita puntos duplicados
    expect(inputMonto.value).toBe('1500.50');
  });

  it('debe llamar a tRPC con los datos correctos en el flujo feliz', async () => {
    render(
      <NuevoCargoModal isOpen={true} onClose={onClose} alumnoId={10} cicloId={2} />
    );

    // Llenar datos
    fireEvent.change(screen.getByPlaceholderText(/Ej. Libro de Inglés/i), { target: { value: 'Excursión' } });
    fireEvent.change(screen.getByPlaceholderText(/Ej. 1500/i), { target: { value: '250' } });
    // Fecha ya tiene valor default de hoy

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /Generar Cargo/i });
    fireEvent.click(submitBtn);

    expect(mockCreateCargo).toHaveBeenCalledTimes(1);
    const args = mockCreateCargo.mock.calls[0][0];

    expect(args.alumnoId).toBe(10);
    expect(args.cicloId).toBe(2);
    expect(args.concepto).toBe('Excursión');
    expect(args.monto).toBe(250);
    expect(args.fechaVencimiento).toBeDefined();

    // onSuccess debe haber sido llamado
    await waitFor(() => {
      expect(mockInvalidateAdeudos).toHaveBeenCalledWith({ alumnoId: 10 });
    });
    expect(onClose).toHaveBeenCalled();
  });
});