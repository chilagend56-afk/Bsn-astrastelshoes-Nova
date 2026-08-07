import fs from 'fs';

let content = fs.readFileSync('src/contexts/SystemSettingsContext.tsx', 'utf8');

content = content.replace(
/payload => \{\n\s*setSettings\(\(prev: any\) => \(\{ \.\.\.prev,\n\s*siteName: payload\.new/,
`payload => {
        const pNew: any = payload.new;
        setSettings((prev: any) => ({ ...prev,
          siteName: pNew`
);

content = content.replace(/payload\.new\./g, 'pNew.');

fs.writeFileSync('src/contexts/SystemSettingsContext.tsx', content);
