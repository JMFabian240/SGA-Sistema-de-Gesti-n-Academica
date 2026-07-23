import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NuevoTutorModal } from './NuevoTutorModal';

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x" />
}));

const mockCreateTutor = vi.fn();
const mockLinkTutor = vi.fn();
const mockInvalidate = vi.fn();

vi.mock('../../../lib/trpc', () => ({
  trpc: {
    useUtils: () => ({
      tutores: {
        getAll: { invalidate: mockInvalidate }
      }
    }),
    tutores: {
      create: {
        useMutation: () => ({
          mutateAsync: mockCreateTutor
        })
      }
    },
    alumnos: {
      linkTutor: {
        useMutation: () => ({
          mutateAsync: mockLinkTutor
        })
      }
    }
  }
}));

describe('NuevoTutorModal Component', () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no renderiza nada si isOpen es false', () => {
    const { container } = render(
      <NuevoTutorModal isOpen={false} onClose={onClose} onSuccess={onSuccess} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra error de validación si se envía sin nombre', async () => {
    render(<NuevoTutorModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);

    const submitBtn = screen.getByRole('button', { name: /Registrar Tutor/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('El nombre completo es requerido')).toBeInTheDocument();
    });

    expect(mockCreateTutor).not.toHaveBeenCalled();
  });

  it('muestra campos fiscales al marcar "Requiere Factura"', async () => {
    const { container } = render(<NuevoTutorModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);

    expect(screen.queryByText(/Razón Social/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^RFC/i)).not.toBeInTheDocument();

    const checkFactura = container.querySelector('input[name="requiereFactura"]') as HTMLInputElement;
    fireEvent.click(checkFactura);

    await waitFor(() => {
      expect(screen.getByText(/Razón Social/i)).toBeInTheDocument();
      expect(screen.getByText(/^RFC/i)).toBeInTheDocument();
    });
  });

  it('llama a createTutor y linkTutor si se envían datos válidos (factura false)', async () => {
    mockCreateTutor.mockResolvedValueOnce({ tutorId: 50 });
    mockLinkTutor.mockResolvedValueOnce({});

    const { container } = render(
      <NuevoTutorModal isOpen={true} alumnoId={100} onClose={onClose} onSuccess={onSuccess} />
    );

    const inputNombre = container.querySelector('input[name="nombreCompleto"]');
    if (inputNombre) fireEvent.change(inputNombre, { target: { value: 'Juan Perez' } });

    const submitBtn = screen.getByRole('button', { name: /Registrar Tutor/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateTutor).toHaveBeenCalledTimes(1);
    });

    const createArgs = mockCreateTutor.mock.calls[0][0];
    expect(createArgs.nombreCompleto).toBe('Juan Perez');
    expect(createArgs.requiereFactura).toBe(false);
    expect(createArgs.datosFiscales).toBeUndefined();

    await waitFor(() => {
      expect(mockLinkTutor).toHaveBeenCalledTimes(1);
    });

    const linkArgs = mockLinkTutor.mock.calls[0][0];
    expect(linkArgs.alumnoId).toBe(100);
    expect(linkArgs.tutorId).toBe(50);
    expect(linkArgs.esPrincipal).toBe(true);

    expect(mockInvalidate).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});