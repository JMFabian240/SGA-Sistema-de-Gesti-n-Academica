import * as XLSX from 'xlsx';
import * as path from 'path';

export interface AlumnoParsed {
  nombre: string;
  sheetName: string;
  pagoMeses: number;
  moroso: boolean;
  matricula: string;
}

export const parseSheetName = (sheetName: string) => {
  const numMatch = sheetName.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : 1;
  let code = 'PRI';
  if (sheetName.includes('K')) code = 'PRE';
  if (sheetName.includes('S')) code = 'SEC';
  if (sheetName.includes('B')) code = 'BAC';
  return { gradoNum: num, nivelCode: code };
};

export const getDobFromGrade = (gradoNumero: number, nivelCodigo: string) => {
  const currentYear = new Date().getFullYear();
  let age = 6;
  if (nivelCodigo === 'PRE') age = 3 + (gradoNumero - 1);
  if (nivelCodigo === 'PRI') age = 6 + (gradoNumero - 1);
  if (nivelCodigo === 'SEC') age = 12 + (gradoNumero - 1);
  if (nivelCodigo === 'BAC') age = 15 + (Math.floor((gradoNumero - 1) / 2)); 

  const birthYear = currentYear - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, month, day);
};

export const getLetraGrupo = (nivelCode: string) => {
  if (nivelCode === 'PRE') return 'K';
  if (nivelCode === 'PRI') return 'P';
  if (nivelCode === 'SEC') return 'S';
  if (nivelCode === 'BAC') return 'B';
  return 'A';
};

export const parseExcel = () => {
  const filePath = path.resolve('C:\\Users\\josem\\Documents\\San_Diego\\sga\\docs\\resources\\data\\INSCRITOS CONTROL 25-26 A CORTE.xlsx');
  const workbook = XLSX.readFile(filePath);

  const morososNombres = new Set<string>();
  const adeudosSheet = workbook.Sheets['ADEUDOS'];
  if (adeudosSheet) {
    const dataAdeudos = XLSX.utils.sheet_to_json<any>(adeudosSheet, { header: 1 });
    for (const row of dataAdeudos) {
      if (!row || row.length === 0) continue;
      const nombre = row[0];
      if (nombre && typeof nombre === 'string' && nombre.length > 5) {
        const upper = nombre.toUpperCase();
        if (!upper.includes('PRIMARIA') && !upper.includes('PRESCOLAR') && !upper.includes('SECUNDARIA') && !upper.includes('BACHILLERATO') && !upper.includes('ADEUDO')) {
          morososNombres.add(nombre.trim().toUpperCase());
        }
      }
    }
  }

  const alumnosList: AlumnoParsed[] = [];
  const nombresUnicos = new Set<string>();
  const sheetNamesUsed: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    if (['MATRICULA', 'CONTROL FACTURACION', 'ADEUDOS'].includes(sheetName)) continue;
    sheetNamesUsed.push(sheetName);

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });
    
    for (let i = 5; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;
      
      const rawMatricula = row[2];
      const alumnoNombre = row[3]; 
      const planPagoTexto = String(row[20] || ''); 
      
      if (alumnoNombre && typeof alumnoNombre === 'string' && alumnoNombre.trim() !== '' && alumnoNombre.trim() !== 'NOMBRE DEL ALUMNO') {
        const nombreClean = alumnoNombre.trim();
        const nombreUpper = nombreClean.toUpperCase();
        
        if (nombreUpper.includes('IRRIGULARIDADES') || nombreUpper.includes('TOTAL') || nombreClean.length < 5) continue;
        
        if (!nombresUnicos.has(nombreUpper)) {
          nombresUnicos.add(nombreUpper);
          alumnosList.push({
            nombre: nombreClean,
            sheetName: sheetName,
            pagoMeses: planPagoTexto.includes('12') ? 12 : 10,
            moroso: morososNombres.has(nombreUpper),
            matricula: (rawMatricula && rawMatricula !== 'NUEVO INGRESO') ? String(rawMatricula).trim() : ''
          });
        }
      }
    }
  }

  return { alumnosList, sheetNamesUsed };
};
