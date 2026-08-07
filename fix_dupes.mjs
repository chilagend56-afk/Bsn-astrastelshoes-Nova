import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const duplicateString = `const fileExt = compressedFile.name.split('.').pop() || 'png';
                              const fileName = \`product_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${fileExt}\`;
                              const filePath = \`\${fileName}\`;
                              const fileName = \`product_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${fileExt}\`;
                              const filePath = \`\${fileName}\`;`;

const fixedString = `const fileExt = compressedFile.name.split('.').pop() || 'png';
                              const fileName = \`product_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${fileExt}\`;
                              const filePath = \`\${fileName}\`;`;

if (content.includes(duplicateString)) {
  content = content.replace(duplicateString, fixedString);
  fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
  console.log('Fixed duplicates!');
} else {
  console.log('Could not find duplicates string exact match');
}
