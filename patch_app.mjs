import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('InstallPWA')) {
  content = content.replace(
    'import { AIAssistant } from \'./components/ui/AIAssistant\';',
    'import { AIAssistant } from \'./components/ui/AIAssistant\';\nimport { InstallPWA } from \'./components/ui/InstallPWA\';'
  );
  
  content = content.replace(
    '<AIAssistant />',
    '<AIAssistant />\n            <InstallPWA />'
  );
  
  fs.writeFileSync('src/App.tsx', content);
  console.log('App patched');
}
