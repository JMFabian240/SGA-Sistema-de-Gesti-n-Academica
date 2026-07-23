import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditarAlumnoModal } from './EditarAlumnoModal';

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x" />,
  Calendar: () => <span data-testid="icon-calendar" />
}));

let mockNiveles: any[] | undefined = [{ nivelId: 1, nombre: 'Primaria' }];
let mockGrados: any[] | undefined = [{ gradoId: 1, nivelId: 1, nombre: '1ro' }];
let mockGrupos: any[] | undefined = [{ grupoId: 1, gradoId: 1, nivelId: 1, nombre: '1ro A', seccion: 'A' }];

const mockMutateAsync = vi.fn();
const mockInvalidate = vi.fn();

vi.mock('../../../lib/trpc', () => ({
  trpc: {
    useUtils: () => ({
      alumnos: {
        getAll: { invalidate: mockInvalidate }
      }
    }),
    grupos: {
      getNiveles: { useQuery: () => ({ data: mockNiveles }) },
      getGrados: { useQuery: () => ({ data: mockGrados }) },
      getGrupos: { useQuery: () => ({ data: mockGrupos }) },
    },
    alumnos: {
      update: {
        useMutation: () => ({
          mutateAsync: mockMutateAsync
        })
      }
    }
  }
}));

const mockAlumno = {
  alumnoId: 10,
  nombreCompleto: 'Maria Lopez',
  fechaNacimiento: '2012-05-15T00:00:00.000Z',
  sexo: 'F',
  matricula: 'MAT-2012',
  curp: 'MARL12345678901234',
  nivelId: 1,
  gradoId: 1,
  inscripciones: [
    { grupoId: 1, grupo: { gradoId: 1 } }
  ]
};

describe('EditarAlumnoModal Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no debe renderizar nada si isOpen es false o alumno es null', () => {
    const { container: container1 } = render(<EditarAlumnoModal isOpen={false} onClose={onClose} alumno={mockAlumno} />);
    expect(container1).toBeEmptyDOMElement();

    const { container: container2 } = render(<EditarAlumnoModal isOpen={true} onClose={onClose} alumno={null} />);
    expect(container2).toBeEmptyDOMElement();
  });

  it('debe renderizar y cargar los datos del alumno correctamente', () => {
    const { container } = render(<EditarAlumnoModal isOpen={true} onClose={onClose} alumno={mockAlumno} />);

    expect(screen.getByText('Editar Alumno')).toBeInTheDocument();

    const inputNombre = container.querySelector('input[name="nombreCompleto"]') as HTMLInputElement;
    expect(inputNombre.value).toBe('Maria Lopez');

    const inputDate = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(inputDate.value).toBe('2012-05-15');

    const inputMatricula = container.querySelector('input[name="matricula"]') as HTMLInputElement;
    expect(inputMatricula.value).toBe('MAT-2012');

    const selectSexo = container.querySelector('select[name="sexo"]') as HTMLSelectElement;
    expect(selectSexo.value).toBe('F');
  });

  it('debe mostrar error de validación si se borran datos requeridos', async () => {
    const { container } = render(<EditarAlumnoModal isOpen={true} onClose={onClose} alumno={mockAlumno} />);

    const inputNombre = container.querySelector('input[name="nombreCompleto"]');
    if (inputNombre) fireEvent.change(inputNombre, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Obligatorio')).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('debe llamar a la API y cerrar el modal al guardar correctamente', async () => {
    mockMutateAsync.mockResolvedValueOnce({});
    const { container } = render(<EditarAlumnoModal isOpen={true} onClose={onClose} alumno={mockAlumno} />);

    const inputNombre = container.querySelector('input[name="nombreCompleto"]');
    if (inputNombre) fireEvent.change(inputNombre, { target: { value: 'Maria Lopez Gomez' } });

    const submitBtn = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    });

    const callArgs = mockMutateAsync.mock.calls[0][0];
    expect(callArgs.alumnoId).toBe(10);
    expect(callArgs.nombreCompleto).toBe('Maria Lopez Gomez');

    // Debería invalidar queries y cerrar modal
    expect(mockInvalidate).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalled();
  });
});