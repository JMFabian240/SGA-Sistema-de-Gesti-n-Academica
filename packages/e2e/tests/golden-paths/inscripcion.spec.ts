import { test, expect } from '@playwright/test';

test('Debe poder acceder a la página principal de la aplicación', async ({ page }) => {
  // Ir a la raíz (la cual está atada al frontend en el puerto 5173 por configuración)
  await page.goto('/');

  // Asumiendo que hay un elemento visible inicial (ej: título, formulario de login, etc)
  // Reemplazar esto con el selector real del login de tu app cuando esté desarrollado.
  // Por ahora verificamos que la página responde sin errores 404
  await expect(page).not.toHaveTitle(/404/);
});
