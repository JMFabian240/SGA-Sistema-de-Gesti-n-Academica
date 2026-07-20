import { PrismaClient } from '@prisma/client';
import { AlumnosService } from '../../../../back-end/src/modules/alumnos/alumnos.service';
import { TutoresService } from '../../../../back-end/src/modules/tutores/tutores.service';
import { parseExcel, parseSheetName, getDobFromGrade } from './excelHelper';

const generateRealisticTutorName = () => {
  const nombres = ['Alejandro', 'Maria', 'Jose', 'Carmen', 'Juan', 'Guadalupe', 'Francisco', 'Margarita', 'Pedro', 'Rosa', 'Antonio', 'Alicia', 'Luis', 'Carlos', 'Ana', 'Laura'];
  const apellidos = ['Garcia', 'Martinez', 'Rodriguez', 'Lopez', 'Hernandez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Gomez', 'Diaz', 'Reyes'];
  
  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
  const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
  
  return `${nombre} ${apellido1} ${apellido2}`;
};

export const seedAlumnosTutores = async (prisma: PrismaClient) => {
  console.log('--- 04 Creando Alumnos y Tutores ---');

  const { alumnosList } = parseExcel();
  const grados = await prisma.grado.findMany({ include: { nivel: true } });

  const alumnosCopia = [...alumnosList];
  alumnosCopia.sort(() => Math.random() - 0.5); // Shuffle
  
  let fallbackMatricula = 20250001;
  const seenMatriculas = new Set<string>();

  while(alumnosCopia.length > 0) {
    const familySize = Math.floor(Math.random() * 3) + 1; // 1, 2 or 3
    const siblings = alumnosCopia.splice(0, familySize);

    // Crear Tutor
    const tutor = await TutoresService.createTutor({
      nombreCompleto: generateRealisticTutorName(),
      correoElectronico: `tutor${fallbackMatricula}@ejemplo.com`,
      telefono: '9211234567',
    });

    for (const sib of siblings) {
      const { gradoNum, nivelCode } = parseSheetName(sib.sheetName);
      const dob = getDobFromGrade(gradoNum, nivelCode);
      const grado = grados.find(g => g.numero === gradoNum && g.nivel.codigo === nivelCode);

      if (!grado) continue;

      let baseMatricula = sib.matricula ? sib.matricula.substring(0, 25) : (fallbackMatricula++).toString();
      let matriculaValue = baseMatricula;
      let counter = 1;
      while (seenMatriculas.has(matriculaValue)) {
        matriculaValue = `${baseMatricula}-${counter}`;
        counter++;
      }
      seenMatriculas.add(matriculaValue);
      
      const alumno = await AlumnosService.createAlumno({
        matricula: matriculaValue,
        nombreCompleto: sib.nombre.substring(0, 120),
        fechaNacimiento: dob.toISOString(),
        sexo: Math.random() > 0.5 ? 'M' : 'F',
        estado: 'ACTIVO',
        nivelId: grado.nivelId,
        gradoId: grado.gradoId,
        curp: `CURP${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`.toUpperCase().substring(0, 18),
      });

      await AlumnosService.linkTutor({
        tutorId: tutor.tutorId,
        alumnoId: alumno.alumnoId,
        parentesco: 'PADRE',
        esPrincipal: true,
      });
    }
  }
};
