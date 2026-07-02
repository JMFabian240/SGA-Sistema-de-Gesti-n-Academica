import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Ejecutar tests en archivos en paralelo */
  fullyParallel: true,
  /* Fallar la construcción en CI si te dejas test.only accidentalmente */
  forbidOnly: !!process.env.CI,
  /* Reintentos */
  retries: process.env.CI ? 2 : 0,
  /* Opt-out de parallel tests en CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter */
  reporter: 'html',
  /* Compartido en todos los proyectos */
  use: {
    /* URL base (Vite Frontend por defecto) */
    baseURL: 'http://127.0.0.1:5173',

    /* Recoger traza cuando falle */
    trace: 'on-first-retry',
  },

  /* Configurar proyectos de navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Correr el frontend y backend local antes de empezar las pruebas */
  webServer: {
    command: 'npm run dev',
    cwd: path.resolve(__dirname, '../../'), // Apuntar al monorepo root
    url: 'http://127.0.0.1:5173', // Esperar hasta que Vite esté listo
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
