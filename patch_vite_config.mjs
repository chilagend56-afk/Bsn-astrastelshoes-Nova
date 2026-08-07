import fs from 'fs';

let content = fs.readFileSync('vite.config.ts', 'utf8');
content = content.replace(/name: 'Novastore'/g, "name: 'Young Dangote'");
content = content.replace(/short_name: 'Novastore'/g, "short_name: 'Young Dangote'");
fs.writeFileSync('vite.config.ts', content);
