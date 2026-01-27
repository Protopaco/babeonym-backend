import { swaggerSpec } from './swaggerSpec.js';
import fs from 'fs';
fs.writeFileSync('../../docs/openapi.json', JSON.stringify(swaggerSpec, null, 2));
console.log('OpenAPI spec exported to docs/openapi.json');
