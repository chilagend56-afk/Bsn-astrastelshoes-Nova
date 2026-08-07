import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(/Young Dangote Tech Hub/g, 'Young Dangote');
fs.writeFileSync('index.html', content);
