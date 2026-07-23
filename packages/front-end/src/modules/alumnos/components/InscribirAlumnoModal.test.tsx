import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InscribirAlumnoModal } from './InscribirAlumnoModal';

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x" />,
  BookOpen: () => <span data-testid="icon-book" />,
  Save: () => <span data-testid="icon-save" />,
  Layers: () => <span data-testid="icon-layers" />,
  GraduationCap: () => <span data-testid="icon-grad" />
}));

let mockCiclos: any[] | undefined = [{ cicloId: 10, nombre: 'Ciclo 2023', activo: true }];
let mockGrupos: any[] | undefined = [{ grupoId: 5, gradoId: 2, nivelId: 1, cicloId: 10, nombre: '2do A' }];
let mockNiveles: any[] | undefined = [{ nivelId: 1, nombre: 'Primaria' }];
let mockGrados: any[] | undefined = [{ gradoId: 2, nivelId: 1, nombre: 'Segundo' }];

const mockMutate = vi.fn();
const mockInvalidate = vi.fn();

vi.mock('../../../lib/trpc', () => ({
  trpc: {
    useUtils: () => ({
      alumnos: {
        getById: { invalidate: mockInvalidate }
      }
    }),
    grupos: {
      getCiclos: { useQuery: () => ({ data: mockCiclos }) },
      getGrupos: { useQuery: () => ({ data: mockGrupos }) },
      getNiveles: { useQuery: () => ({ data: mockNiveles }) },
      getGrados: { useQuery: () => ({ data: mockGrados }) },
    },
    inscripciones: {
      createInscripcion: {
        useMutation: (options: any) => ({
          mutate: (data: any) => {
            mockMutate(data);
            if (options?.onSuccess) {
              options.onSuccess();
            }
          }
        })
      }
    }
  }
}));

describe('InscribirAlumnoModal Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();

    mockCiclos = [{ cicloId: 10, nombre: 'Ciclo 2023', activo: true }];
    mockGrupos = [{ grupoId: 5, gradoId: 2, nivelId: 1, cicloId: 10, nombre: '2do A' }];
    mockNiveles = [{ nivelId: 1, nombre: 'Primaria' }];
    mockGrados = [{ gradoId: 2, nivelId: 1, nombre: 'Segundo' }];
  });

  it('no renderiza nada si isOpen es false', () => {
    const { container } = render(<InscribirAlumnoModal isOpen={false} onClose={onClose} alumnoId={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra mensaje si no hay ciclos activos', () => {
    mockCiclos = [{ cicloId: 10, nombre: 'Ciclo 2023', activo: false }]; // No está activo
    render(<InscribirAlumnoModal isOpen={true} onClose={onClose} alumnoId={1} />);

    expect(screen.getByText(/No hay un ciclo escolar activo actualmente/i)).toBeInTheDocument();
  });

  it('el botón de guardar debe estar deshabilitado si faltan campos', () => {
    render(<InscribirAlumnoModal isOpen={true} onClose={onClose} alumnoId={1} />);

    const submitBtn = screen.getByRole('button', { name: /Guardar Inscripción/i });
    expect(submitBtn).toBeDisabled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('llama a createInscripcion al enviar correctamente', async () => {
    const { container } = render(<InscribirAlumnoModal isOpen={true} onClose={onClose} alumnoId={99} />);

    // Seleccionar nivel
    const selectNivel = container.querySelector('select:nth-of-type(1)');
    if (selectNivel) fireEvent.change(selectNivel, { target: { value: '1' } });

    // Seleccionar grado
    const selectGrado = container.querySelectorAll('select')[1];
    if (selectGrado) fireEvent.change(selectGrado, { target: { value: '2' } });

    // Seleccionar grupo
    const selectGrupo = container.querySelectorAll('select')[2];
    if (selectGrupo) fireEvent.change(selectGrupo, { target: { value: '5' } });

    const submitBtn = screen.getByRole('button', { name: /Guardar Inscripción/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    const args = mockMutate.mock.calls[0][0];

    expect(args.alumnoId).toBe(99);
    expect(args.cicloId).toBe(10);
    expect(args.grupoId).toBe(5);
    expect(args.estadoEnCiclo).toBe('INSCRITO');

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Inscripción realizada'));
    expect(mockInvalidate).toHaveBeenCalledWith(99);
    expect(onClose).toHaveBeenCalled();
  });
});