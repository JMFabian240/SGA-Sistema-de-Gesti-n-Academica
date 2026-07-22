const fs = require('fs');
const path = require('path');

const dataAccessDir = path.resolve(__dirname, '../../data-access');
const rootDir = path.resolve(__dirname, '../../../');
const enginesDir = path.join(rootDir, 'node_modules', '@prisma', 'engines');
const tauriBinariesDir = path.resolve(__dirname, '../../app-tauri/src-tauri/binaries');

if (!fs.existsSync(tauriBinariesDir)) {
  fs.mkdirSync(tauriBinariesDir, { recursive: true });
}

// Copy query engine
const engineFile = 'query_engine-windows.dll.node';
const srcEngine = path.join(enginesDir, engineFile);
const destEngine = path.join(tauriBinariesDir, engineFile);

if (fs.existsSync(srcEngine)) {
  fs.copyFileSync(srcEngine, destEngine);
  console.log('Copied Prisma query engine to Tauri binaries.');
} else {
  console.error('Error: Prisma query engine not found at ' + srcEngine);
}

// Copy schema
const schemaFile = path.join(dataAccessDir, 'prisma', 'schema.prisma');
const destSchema = path.join(tauriBinariesDir, 'schema.prisma');
if (fs.existsSync(schemaFile)) {
  fs.copyFileSync(schemaFile, destSchema);
  console.log('Copied schema.prisma to Tauri binaries.');
} else {
  console.error('Error: schema.prisma not found at ' + schemaFile);
}
