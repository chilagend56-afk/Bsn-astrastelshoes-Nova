import fs from 'fs';
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

content = content.replace(
/updated_at: new Date\(\)\.toISOString\(\)/,
`// updated_at: new Date().toISOString() // removed as column doesn't exist`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
