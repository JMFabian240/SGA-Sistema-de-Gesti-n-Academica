const XLSX = require('xlsx');
const path = require('path');

const filePath = path.resolve('C:\\Users\\josem\\Documents\\San_Diego\\sga\\docs\\resources\\data\\INSCRITOS CONTROL 25-26 A CORTE.xlsx');
const workbook = XLSX.readFile(filePath);

const adeudosSheet = workbook.Sheets['ADEUDOS'];
if (adeudosSheet) {
  const data = XLSX.utils.sheet_to_json(adeudosSheet, { header: 1 });
  console.log("ADEUDOS rows:");
  for (let i = 0; i < 20; i++) {
    if (data[i]) console.log(`Row ${i}:`, data[i]);
  }
}
