import { swaggerSpec } from './swaggerSpec.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

fs.writeFileSync(path.join(__dirname, '../../docs/openapi.json'), JSON.stringify(swaggerSpec, null, 2));
console.log('OpenAPI spec exported to docs/openapi.json');
