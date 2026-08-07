import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace("import { InstallPWA } from './components/ui/InstallPWA';\n", "");
content = content.replace("<InstallPWA />", "");
fs.writeFileSync('src/App.tsx', content);
