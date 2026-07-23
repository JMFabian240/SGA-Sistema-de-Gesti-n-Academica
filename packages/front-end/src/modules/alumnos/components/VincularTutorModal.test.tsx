import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VincularTutorModal } from './VincularTutorModal';
import React from 'react';

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x" />,
  Search: () => <span data-testid="icon-search" />,
  Link: () => <span data-testid="icon-link" />
}));

let mockTutores: any[] | undefined = [
  { tutorId: 1, nombreCompleto: 'Juan Perez', telefono: '1234', correoElectronico: 'juan@test.com' },
  { tutorId: 2, nombreCompleto: 'Maria Garcia', telefono: '5678', correoElectronico: 'maria@test.com' }
];

const mockLinkTutor = vi.fn();

vi.mock('../../../lib/trpc', () => ({
  trpc: {
    tutores: {
      getAll: { useQuery: () => ({ data: mockTutores, isLoading: false }) }
    },
    alumnos: {
      linkTutor: {
        useMutation: () => ({
          mutateAsync: mockLinkTutor,
          isPending: false
        })
      }
    }
  }
}));

describe('VincularTutorModal Component', () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();
  const onRegistrarPadre = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    mockTutores = [
      { tutorId: 1, nombreCompleto: 'Juan Perez', telefono: '1234', correoElectronico: 'juan@test.com' },
      { tutorId: 2, nombreCompleto: 'Maria Garcia', telefono: '5678', correoElectronico: 'maria@test.com' }
    ];
  });

  it('no renderiza nada si isOpen es false', () => {
    const { container } = render(
      <VincularTutorModal isOpen={false} alumnoId={1} onClose={onClose} onSuccess={onSuccess} onRegistrarPadre={onRegistrarPadre} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza la lista de tutores y permite buscar', () => {
    render(
      <VincularTutorModal isOpen={true} alumnoId={1} onClose={onClose} onSuccess={onSuccess} onRegistrarPadre={onRegistrarPadre} />
    );
    
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Maria Garcia')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre, correo.../i);
    fireEvent.change(searchInput, { target: { value: 'maria' } });

    expect(screen.queryByText('Juan Perez')).not.toBeInTheDocument();
    expect(screen.getByText('Maria Garcia')).toBeInTheDocument();
  });

  it('llama a onRegistrarPadre al hacer click en el botón correspondiente', () => {
    render(
      <VincularTutorModal isOpen={true} alumnoId={1} onClose={onClose} onSuccess={onSuccess} onRegistrarPadre={onRegistrarPadre} />
    );
    
    const registrarBtn = screen.getByRole('button', { name: /Registrar Padre/i });
    fireEvent.click(registrarBtn);

    expect(onRegistrarPadre).toHaveBeenCalledTimes(1);
  });

  it('llama a linkTutor y onSuccess al hacer click en Vincular', async () => {
    mockLinkTutor.mockResolvedValueOnce({});
    
    render(
      <VincularTutorModal isOpen={true} alumnoId={99} onClose={onClose} onSuccess={onSuccess} onRegistrarPadre={onRegistrarPadre} />
    );
    
    const vincularBtns = screen.getAllByRole('button', { name: /Vincular/i });
    fireEvent.click(vincularBtns[0]); // Click en el de Juan Perez

    await waitFor(() => {
      expect(mockLinkTutor).toHaveBeenCalledTimes(1);
    });

    const linkArgs = mockLinkTutor.mock.calls[0][0];
    expect(linkArgs.alumnoId).toBe(99);
    expect(linkArgs.tutorId).toBe(1);
    expect(linkArgs.esPrincipal).toBe(true);

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});