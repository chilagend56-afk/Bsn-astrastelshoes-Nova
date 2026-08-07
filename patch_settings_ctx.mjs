import fs from 'fs';

let content = fs.readFileSync('src/contexts/SystemSettingsContext.tsx', 'utf8');
content = content.replace(/siteName: 'Young Dangote Tech Hub'/g, "siteName: 'Young Dangote'");
fs.writeFileSync('src/contexts/SystemSettingsContext.tsx', content);
