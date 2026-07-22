const fs = require('fs');
const path = require('path');

const dataAccessDir = path.resolve(__dirname, '../../data-access');
const migrationsDir = path.join(dataAccessDir, 'prisma', 'migrations');
const tauriResourcesDir = path.resolve(__dirname, '../../app-tauri/src-tauri/pgsql');

if (!fs.existsSync(tauriResourcesDir)) {
  fs.mkdirSync(tauriResourcesDir, { recursive: true });
}

const outputFile = path.join(tauriResourcesDir, 'init_db.sql');

let finalSql = '';

if (fs.existsSync(migrationsDir)) {
  const items = fs.readdirSync(migrationsDir);
  const migrationFolders = items.filter(f => !f.endsWith('.toml') && !f.endsWith('.sql'));
  migrationFolders.sort();

  for (const folder of migrationFolders) {
    const sqlFile = path.join(migrationsDir, folder, 'migration.sql');
    if (fs.existsSync(sqlFile)) {
      finalSql += `-- Migration: ${folder}\n`;
      finalSql += fs.readFileSync(sqlFile, 'utf8') + '\n\n';
    }
  }
}

fs.writeFileSync(outputFile, finalSql, 'utf8');
console.log('Concatenated all migrations into init_db.sql');
