const XLSX = require('xlsx');
const path = require('path');

const filePath = path.resolve('C:\\Users\\josem\\Documents\\San_Diego\\sga\\docs\\resources\\data\\INSCRITOS CONTROL 25-26 A CORTE.xlsx');
const workbook = XLSX.readFile(filePath);

console.log("Sheet names:", workbook.SheetNames);

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

for (let i = 0; i < Math.min(250, data.length); i++) {
  const row = data[i];
  if (!row || row.length === 0) continue;
  
  // Imprimir filas que tengan algún indicio de "NIVEL" o nombres en mayuscula como "PREESCOLAR", "PRIMARIA", "SECUNDARIA"
  const rowStr = JSON.stringify(row);
  if (rowStr.includes("PREESCOLAR") || rowStr.includes("PRIMARIA") || rowStr.includes("SECUNDARIA") || rowStr.includes("GRADO") || rowStr.includes("NIVEL")) {
    console.log(`Line ${i}:`, row);
  }
}
