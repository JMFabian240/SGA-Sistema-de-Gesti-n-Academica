import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Search } from 'lucide-react';
import { trpc } from '../../../../lib/trpc';
import { Button } from '../../../../components/ui/Button/Button';
import { Table, type Column } from '../../../../components/ui/Table/Table';
import { Badge } from '../../../../components/ui/Badge/Badge';
import { Input } from '../../../../components/ui/Input/Input';
import { Spinner } from '../../../../components/ui/Spinner/Spinner';
import { useState } from 'react';
import styles from '../../../grupos/pages/NivelesListPage/NivelesListPage.module.css';

type AlumnoRow = {
  alumnoId: number;
  matricula: string | null;
  nombreCompleto: string;
  curp: string;
  sexo: string;
  estado: string;
  nivel: { nombre: string } | null;
};

export function AlumnosListPage() {
  const navigate = useNavigate();
  const { data: alumnos, isLoading } = trpc.alumnos.getAll.useQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlumnos = (alumnos as any[])?.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      a.nombreCompleto.toLowerCase().includes(term) ||
      a.curp.toLowerCase().includes(term) ||
      (a.matricula && a.matricula.toLowerCase().includes(term))
    );
  }) || [];

  const columns: Column<AlumnoRow>[] = [
    { header: 'Matrícula', accessor: (row) => row.matricula || <span style={{ color: '#9ca3af' }}>N/A</span> },
    { header: 'Nombre Completo', accessor: 'nombreCompleto' },
    { header: 'CURP', accessor: 'curp' },
    { header: 'Sexo', accessor: 'sexo' },
    { header: 'Nivel', accessor: (row) => row.nivel?.nombre || <span style={{ color: '#9ca3af' }}>Sin Asignar</span> },
    {
      header: 'Estado',
      accessor: (row) => {
        let variant: 'success' | 'warning' | 'danger' | 'default' = 'default';
        if (row.estado === 'ACTIVO') variant = 'success';
        else if (row.estado === 'BAJA_DEFINITIVA') variant = 'danger';
        else if (row.estado === 'BAJA_TEMPORAL') variant = 'warning';
        return <Badge variant={variant}>{row.estado}</Badge>;
      }
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Pencil size={16} />}
            onClick={() => navigate(`/alumnos/${row.alumnoId}/editar`)}
          >
            Editar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div style={{ width: '300px' }}>
          <Input
            placeholder="Buscar por nombre, CURP o matrícula..."
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => navigate('/alumnos/nuevo')}
          leftIcon={<Plus size={20} />}
        >
          Registrar Nuevo Alumno
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        {isLoading ? (
          <Spinner centered />
        ) : (
          <Table<AlumnoRow>
            columns={columns}
            data={filteredAlumnos as AlumnoRow[]}
            keyExtractor={(row) => row.alumnoId.toString()}
          />
        )}
      </div>
    </div>
  );
}
