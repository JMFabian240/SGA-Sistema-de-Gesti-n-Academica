import { PrismaClient } from '@prisma/client';
import { GruposService } from '../../../../back-end/src/modules/grupos/grupos.service';
import { parseExcel, parseSheetName, getLetraGrupo } from './excelHelper';

export const seedGrupos = async (prisma: PrismaClient) => {
  console.log('--- 03 Creando Grupos ---');
  
  const { sheetNamesUsed } = parseExcel();
  const grados = await prisma.grado.findMany({ include: { nivel: true } });
  
  const cicloAnual = await prisma.cicloEscolar.findFirst({ where: { activo: true, periodicidad: 'ANUAL' } });
  const cicloSemestral = await prisma.cicloEscolar.findFirst({ where: { activo: true, periodicidad: 'SEMESTRAL' } });

  if (!cicloAnual || !cicloSemestral) throw new Error('Ciclos no encontrados');

  for (const sheetName of sheetNamesUsed) {
    const { gradoNum, nivelCode } = parseSheetName(sheetName);
    const grado = grados.find(g => g.numero === gradoNum && g.nivel.codigo === nivelCode);
    
    if (grado) {
      const cicloParaGrupo = nivelCode === 'BAC' ? cicloSemestral : cicloAnual;
      const letra = getLetraGrupo(nivelCode);
      
      const existing = await prisma.grupo.findFirst({
        where: { nombre: letra, cicloId: cicloParaGrupo.cicloId, gradoId: grado.gradoId }
      });

      if (!existing) {
        await GruposService.createGrupo({
          nombre: letra,
          cupoMaximo: 40,
          nivelId: grado.nivelId,
          cicloId: cicloParaGrupo.cicloId,
          gradoId: grado.gradoId,
        });
      }
    }
  }
};
