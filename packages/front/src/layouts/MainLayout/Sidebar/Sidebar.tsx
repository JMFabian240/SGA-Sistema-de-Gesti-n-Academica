import { NavLink } from 'react-router-dom';
import {
  Home, Users, Heart, Book, GraduationCap, FileText, FileSignature,
  CreditCard, Star, BarChart3, Settings, UserCog, History, Shield, LogOut
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { clsx } from 'clsx';

const NAVIGATION = [
  {
    category: 'PRINCIPAL',
    items: [
      { name: 'Dashboard', to: '/dashboard', icon: Home },
    ]
  },
  {
    category: 'ACADÉMICO',
    items: [
      { name: 'Alumnos', to: '/alumnos', icon: Users },
      { name: 'Padres & Tutores', to: '/tutores', icon: Heart },
      { name: 'Grupos & Materias', to: '/grupos', icon: Book },
      { name: 'Calificaciones', to: '/calificaciones', icon: GraduationCap },
      { name: 'Historial Académico', to: '/historial', icon: FileText },
      { name: 'Boletas', to: '/boletas', icon: FileSignature },
    ]
  },
  {
    category: 'FINANZAS',
    items: [
      { name: 'Registro de Pagos', to: '/pagos', icon: CreditCard },
      { name: 'Gestión de Becas', to: '/becas', icon: Star },
      { name: 'Reportes', to: '/reportes', icon: BarChart3 },
    ]
  },
  {
    category: 'SISTEMA',
    items: [
      { name: 'Configuración', to: '/configuracion', icon: Settings },
      { name: 'Usuarios', to: '/usuarios', icon: UserCog },
      { name: 'Bitácora', to: '/bitacora', icon: History },
    ]
  }
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoAvatar}>
          <Shield size={24} className={styles.logoIcon} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>San Diego</span>
          <span className={styles.logoSubtitle}>Colegio Privado</span>
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
        <button className={styles.logoutBtn} title="Cerrar sesión">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
