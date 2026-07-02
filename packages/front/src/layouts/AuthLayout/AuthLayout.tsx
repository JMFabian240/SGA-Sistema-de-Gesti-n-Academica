import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.branding}>
          <h1 className={styles.logo}>SGA</h1>
          <p className={styles.subtitle}>Sistema de Gestión Académico</p>
        </div>
        <div className={styles.illustration}>
          {/* Aquí podría ir una ilustración SVG abstracta */}
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
