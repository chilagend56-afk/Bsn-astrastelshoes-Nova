import fs from 'fs';

let content = fs.readFileSync('src/contexts/SystemSettingsContext.tsx', 'utf8');

content = content.replace(
/payload => \{\n\s*setSettings\(\(prev: any\) => \(\{ \.\.\.prev,\n\s*siteName: pNew/,
`payload => {
        const pNew: any = payload.new;
        setSettings((prev: any) => ({ ...prev, 
          siteName: pNew`
);

fs.writeFileSync('src/contexts/SystemSettingsContext.tsx', content);
