import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  // Create public directory if it doesn't exist
  mkdirSync(join(__dirname, '../public'), { recursive: true });

  // Copy sql-wasm.wasm file
  copyFileSync(
    join(__dirname, '../node_modules/sql.js/dist/sql-wasm.wasm'),
    join(__dirname, '../public/sql-wasm.wasm')
  );

  console.log('Successfully copied sql-wasm.wasm to public directory');
} catch (error) {
  console.error('Error copying sql-wasm.wasm:', error);
  process.exit(1);
}