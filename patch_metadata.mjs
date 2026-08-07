import fs from 'fs';
let content = fs.readFileSync('metadata.json', 'utf8');
content = content.replace(/"name": "Young Dangote Tech Hub"/, '"name": "Young Dangote"');
fs.writeFileSync('metadata.json', content);
