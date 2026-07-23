import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CajaPage } from './CajaPage';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// ─────────────────────────────────────────────────
// Mocks de íconos
// ─────────────────────────────────────────────────
vi.mock('lucide-react', () => ({
  Search: () => React.createElement('span', { 'data-testid': 'search-icon' }),
  User: () => React.createElement('span', { 'data-testid': 'user-icon' }),
  FileText: () => React.createElement('span', { 'data-testid': 'file-icon' }),
  AlertCircle: () => React.createElement('span', { 'data-testid': 'alert-icon' }),
  PlusCircle: () => React.createElement('span', { 'data-testid': 'plus-icon' }),
  CheckSquare: () => React.createElement('span', { 'data-testid': 'check-square-icon' }),
  Square: () => React.createElement('span', { 'data-testid': 'square-icon' }),
  ArrowLeft: () => React.createElement('span', { 'data-testid': 'arrow-left-icon' }),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

// ─────────────────────────────────────────────────
// Mock de componentes hijos
// ─────────────────────────────────────────────────
vi.mock('../components/TicketCheckout', () => ({
  TicketCheckout: ({ adeudosSeleccionados }: { adeudosSeleccionados: any[] }) =>
    React.createElement(
      'div',
      { 'data-testid': 'ticket-checkout' },
      `Adeudos seleccionados: ${adeudosSeleccionados.length}`
    ),
}));

vi.mock('../components/NuevoCargoModal', () => ({
  NuevoCargoModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen
      ? React.createElement('div', { 'data-testid': 'nuevo-cargo-modal' }, 'Modal Cargo Abierto')
      : null,
}));

// ─────────────────────────────────────────────────
// Datos de prueba
// ─────────────────────────────────────────────────
const mockAdeudos = [
  {
    calendarioPagoId: 1,
    concepto: 'Colegiatura Agosto',
    saldoPendiente: 1500,
    fechaVencimiento: new Date('2099-08-01').toISOString(),
    estadoCobro: 'PENDIENTE',
    montoPagado: null,
    montoRecargo: 0,
    cicloId: 1,
  },
  {
    calendarioPagoId: 2,
    concepto: 'Colegiatura Septiembre',
    saldoPendiente: 1500,
    fechaVencimiento: new Date('2099-09-01').toISOString(),
    estadoCobro: 'PENDIENTE',
    montoPagado: null,
    montoRecargo: 0,
    cicloId: 1,
  },
  {
    calendarioPagoId: 3,
    concepto: 'Colegiatura Julio',
    saldoPendiente: 0,
    fechaVencimiento: new Date('2099-07-01').toISOString(),
    estadoCobro: 'PAGADO',
    montoPagado: 1500,
    montoRecargo: 0,
    cicloId: 1,
  },
];

const mockAlumnos = [
  {
    alumnoId: 1,
    nombreCompleto: 'Carlos López Martínez',
    matricula: 'LOMC010101HDFRRS01',
    tutoresAlumnos: [
      { tutorId: 99, esPrincipal: true, tutor: { nombreCompleto: 'Juan López' } },
    ],
  },
];

const mockAlumnoDetalle = {
  alumnoId: 1,
  nombreCompleto: 'Carlos López Martínez',
  nivel: { nombre: 'Primaria' },
  grado: { nombre: '1°' },
  inscripciones: [{ cicloId: 1 }],
};

// ─────────────────────────────────────────────────
// Estado mutable de mocks tRPC
// ─────────────────────────────────────────────────
let adeudosQueryReturn: any;
let alumnosQueryReturn: any;
let alumnoByIdQueryReturn: any;

vi.mock('../../../lib/trpc', () => ({
  trpc: {
    dashboard: {
      obtenerTopDeudores: { useQuery: () => ({ data: [] }) },
      obtenerUltimosPagos: { useQuery: () => ({ data: [] }) },
      obtenerCuentasPendientes: { useQuery: () => ({ data: [] }) },
    },
    alumnos: {
      getAll: { useQuery: () => alumnosQueryReturn },
      getById: { useQuery: () => alumnoByIdQueryReturn },
    },
    pagos: {
      getAdeudos: {
        useQuery: (_: any, opts: any) =>
          opts?.enabled ? adeudosQueryReturn : { data: [], isLoading: false },
      },
      aplicarRecargoManual: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}));

// ─────────────────────────────────────────────────
// Helper de render
// ─────────────────────────────────────────────────
const renderCaja = () =>
  render(
    <BrowserRouter>
      <CajaPage />
    </BrowserRouter>
  );

// ─────────────────────────────────────────────────
// Suite de pruebas
// ─────────────────────────────────────────────────
describe('CajaPage — Punto de Cobro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adeudosQueryReturn = { data: [], isLoading: false, refetch: vi.fn() };
    alumnosQueryReturn = { data: [], isLoading: false };
    alumnoByIdQueryReturn = { data: null, isLoading: false };
  });

  // ─── 1. Estado inicial ───────────────────────
  it('debe renderizar el título "Punto de Cobro" y el buscador en el estado inicial', () => {
    renderCaja();
    expect(screen.getByText('Punto de Cobro')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Buscar alumno por nombre, apellidos o matrícula...')
    ).toBeInTheDocument();
  });

  it('no debe mostrar resultados de búsqueda con 2 caracteres o menos', () => {
    renderCaja();
    fireEvent.change(
      screen.getByPlaceholderText(/Buscar alumno/),
      { target: { value: 'Ca' } }
    );
    expect(screen.queryByText('Carlos López Martínez')).not.toBeInTheDocument();
  });

  // ─── 2. Búsqueda ─────────────────────────────
  it('debe mostrar resultados cuando el término tiene más de 2 caracteres', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    expect(screen.getByText('Carlos López Martínez')).toBeInTheDocument();
  });

  it('debe mostrar "No se encontraron alumnos" si la búsqueda no retorna datos', () => {
    alumnosQueryReturn = { data: [], isLoading: false };
    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'ZZZ' } });
    expect(screen.getByText('No se encontraron alumnos')).toBeInTheDocument();
  });

  it('debe mostrar "Buscando..." mientras la query de alumnos está pendiente', () => {
    alumnosQueryReturn = { data: undefined, isLoading: true };
    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    expect(screen.getByText('Buscando...')).toBeInTheDocument();
  });

  // ─── 3. Vista de adeudos al seleccionar alumno ─
  it('debe mostrar el TicketCheckout al seleccionar un alumno del buscador', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: mockAdeudos, isLoading: false, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    expect(screen.getByTestId('ticket-checkout')).toBeInTheDocument();
    expect(screen.getByText('Carlos López Martínez')).toBeInTheDocument();
  });

  it('debe mostrar el estado vacío si el alumno no tiene adeudos', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: [], isLoading: false, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    expect(screen.getByText('Este alumno no tiene adeudos pendientes.')).toBeInTheDocument();
  });

  it('debe mostrar "Cargando adeudos..." mientras se obtienen los adeudos del alumno', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: [], isLoading: true, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    expect(screen.getByText('Cargando adeudos...')).toBeInTheDocument();
  });

  // ─── 4. Toggle de selección ──────────────────
  it('debe incrementar el conteo de seleccionados al hacer click en un adeudo PENDIENTE', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: mockAdeudos, isLoading: false, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    expect(screen.getByTestId('ticket-checkout')).toHaveTextContent('Adeudos seleccionados: 0');
    fireEvent.click(screen.getByText('Colegiatura Agosto'));
    expect(screen.getByTestId('ticket-checkout')).toHaveTextContent('Adeudos seleccionados: 1');
  });

  it('debe deseleccionar un adeudo al hacer click por segunda vez', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: mockAdeudos, isLoading: false, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    fireEvent.click(screen.getByText('Colegiatura Agosto'));
    expect(screen.getByTestId('ticket-checkout')).toHaveTextContent('Adeudos seleccionados: 1');

    fireEvent.click(screen.getByText('Colegiatura Agosto'));
    expect(screen.getByTestId('ticket-checkout')).toHaveTextContent('Adeudos seleccionados: 0');
  });

  it('debe seleccionar únicamente los adeudos PENDIENTES al usar "Marcar todos"', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: mockAdeudos, isLoading: false, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    fireEvent.click(screen.getByText('Marcar todos'));
    // Solo 2 PENDIENTES (Agosto y Septiembre). Julio está PAGADO.
    expect(screen.getByTestId('ticket-checkout')).toHaveTextContent('Adeudos seleccionados: 2');
  });

  it('no debe permitir seleccionar un adeudo con estado PAGADO', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: mockAdeudos, isLoading: false, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    fireEvent.click(screen.getByText('Colegiatura Julio'));
    // Sigue en 0 porque el adeudo está PAGADO
    expect(screen.getByTestId('ticket-checkout')).toHaveTextContent('Adeudos seleccionados: 0');
  });

  // ─── 5. Navegación de regreso ────────────────
  it('debe volver a la vista inicial al hacer click en el botón de regreso', () => {
    alumnosQueryReturn = { data: mockAlumnos, isLoading: false };
    alumnoByIdQueryReturn = { data: mockAlumnoDetalle, isLoading: false };
    adeudosQueryReturn = { data: mockAdeudos, isLoading: false, refetch: vi.fn() };

    renderCaja();
    fireEvent.change(screen.getByPlaceholderText(/Buscar alumno/), { target: { value: 'Car' } });
    fireEvent.click(screen.getByText('Carlos López Martínez'));

    expect(screen.getByTestId('ticket-checkout')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Volver a la vista principal'));

    expect(screen.queryByTestId('ticket-checkout')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar alumno/)).toBeInTheDocument();
  });
});
