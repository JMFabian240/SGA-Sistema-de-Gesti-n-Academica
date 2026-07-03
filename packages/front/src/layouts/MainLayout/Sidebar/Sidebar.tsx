import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, UserSquare2, Users2, Library,
  ClipboardList, WalletCards, BadgePercent,
  LineChart, ShieldAlert, Settings, BookOpen
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { clsx } from 'clsx';

const NAVIGATION = [
  {
    category: 'PRINCIPAL',
    items: [
      { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    category: 'ACADÉMICO',
    items: [
      { name: 'Alumnos', to: '/alumnos', icon: Users2 },
      { name: 'Tutores', to: '/tutores', icon: UserSquare2 },
      { name: 'Grupos', to: '/grupos', icon: Library },
      { name: 'Calificaciones', to: '/calificaciones', icon: LineChart },
      { name: 'Catálogo de Grupos', to: '/catalogos/grupos', icon: BookOpen },
      { name: 'Inscripciones', to: '/inscripciones', icon: ClipboardList },
    ]
  },
  {
    category: 'FINANZAS',
    items: [
      { name: 'Pagos', to: '/pagos', icon: WalletCards },
      { name: 'Becas', to: '/becas', icon: BadgePercent },
      { name: 'Reportes', to: '/reportes', icon: LineChart },
    ]
  },
  {
    category: 'SISTEMA',
    items: [
      { name: 'Configuración', to: '/configuracion', icon: Settings },
      { name: 'Usuarios', to: '/usuarios', icon: ShieldAlert },
      { name: 'Auditoría', to: '/auditoria', icon: ClipboardList },
    ]
  }
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" className={styles.logoImage} />
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>COLEGIO</span>
          <span className={styles.logoSubtitle}>San Diego</span>
        </div>
      </div>
      <nav className={styles.nav}>
        {NAVIGATION.map((group) => (
          <div key={group.category} className={styles.navGroup}>
            <div className={styles.navCategory}>{group.category}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(styles.navItem, isActive && styles.navItemActive)
                  }
                >
                  <Icon size={18} className={styles.icon} />
                  <span className={styles.label}>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>E</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Elizabeth Mendoz...</span>
          <span className={styles.userRole}>ADMIN</span>
        </div>
      </div>
    </aside>
  );
}
