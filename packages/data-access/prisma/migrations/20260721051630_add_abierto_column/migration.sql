/*
  Warnings:

  - You are about to drop the column `fecha_vencimiento_defecto` on the `configuracion_global` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EstadoAlumno" ADD VALUE 'RETENCION_FINANCIERA';
ALTER TYPE "EstadoAlumno" ADD VALUE 'RETENCION_ACADEMICA';
ALTER TYPE "EstadoAlumno" ADD VALUE 'PREINSCRIPCION';

-- AlterTable
ALTER TABLE "ciclo_escolar" ADD COLUMN     "abierto" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "configuracion_global" DROP COLUMN "fecha_vencimiento_defecto",
ADD COLUMN     "dia_vencimiento_mensual" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ventana_inscripcion_temprana" ADD COLUMN     "descuento_inscripcion" DECIMAL(5,2),
ADD COLUMN     "grado_id" INTEGER,
ADD COLUMN     "nivel_id" INTEGER;

-- CreateTable
CREATE TABLE "ventana_grupo" (
    "ventana_id" INTEGER NOT NULL,
    "grupo_id" INTEGER NOT NULL,

    CONSTRAINT "ventana_grupo_pkey" PRIMARY KEY ("ventana_id","grupo_id")
);

-- AddForeignKey
ALTER TABLE "ventana_inscripcion_temprana" ADD CONSTRAINT "ventana_inscripcion_temprana_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "nivel_educativo"("nivel_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventana_inscripcion_temprana" ADD CONSTRAINT "ventana_inscripcion_temprana_grado_id_fkey" FOREIGN KEY ("grado_id") REFERENCES "grado"("grado_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventana_grupo" ADD CONSTRAINT "ventana_grupo_ventana_id_fkey" FOREIGN KEY ("ventana_id") REFERENCES "ventana_inscripcion_temprana"("ventana_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventana_grupo" ADD CONSTRAINT "ventana_grupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupo"("grupo_id") ON DELETE RESTRICT ON UPDATE CASCADE;
