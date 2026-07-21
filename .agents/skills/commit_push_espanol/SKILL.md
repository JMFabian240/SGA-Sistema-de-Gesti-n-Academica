---
name: commit-push-espanol
description: Skill para realizar commits atómicos y pushes con mensajes en español.
---

# Instrucciones para commit y push

Cuando termines de realizar cualquier cambio en el código, debes hacer commit (y push) de manera automática. El usuario solo intervendrá para especificar otra rama destino si es necesario. Para realizar el proceso:
1. Revisar los archivos modificados.
2. Asegurarte de que los cambios sean atómicos (que pertenezcan a una sola funcionalidad o corrección lógica). Si hay varios cambios inconexos, puedes sugerir o separar los commits.
3. Usar convenciones estándar (Conventional Commits) pero con la descripción en **español**: `feat: <descripción>`, `fix: <descripción>`, `chore: <descripción>`, etc.
4. Ejecutar `git add` y `git commit`.
5. Ejecutar `git push` **automáticamente** a la rama actual (por defecto). Si el usuario especifica una rama destino diferente, haz push a esa rama (ej. `git push origin <rama_especificada>`). Puedes verificar la rama actual con `git branch --show-current`.
6. Responder al usuario en español informándole que los cambios se han guardado y subido exitosamente a la rama correspondiente.
