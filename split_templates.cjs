const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'examTemplates.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const templates = JSON.parse(rawData);

const categories = {};
templates.forEach(t => {
  if (!categories[t.category]) {
    categories[t.category] = [];
  }
  categories[t.category].push(t);
});

const outDir = path.join(__dirname, 'src', 'data', 'templates');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const imports = [];
const exportsArray = [];

Object.entries(categories).forEach(([category, items]) => {
  // Replace invalid characters for filenames and variables
  const filename = category.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.json';
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf-8');
  
  const varName = category.replace(/[^a-zA-Z0-9]/g, '') + 'Templates';
  imports.push(`import ${varName} from './templates/${filename}';`);
  exportsArray.push(`...${varName}`);
});

const indexContent = `${imports.join('\n')}

export const EXAM_TEMPLATES = [
  ${exportsArray.join(',\n  ')}
];

export default EXAM_TEMPLATES;
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'index.ts'), indexContent, 'utf-8');
console.log('Split into ' + Object.keys(categories).length + ' files successfully.');
