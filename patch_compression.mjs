import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Ensure import for image compression is present
if (!content.includes('import imageCompression')) {
  content = content.replace(
    'import React, { useState, useEffect } from \'react\';',
    'import React, { useState, useEffect } from \'react\';\nimport imageCompression from \'browser-image-compression\';'
  );
}

// Update product image upload
content = content.replace(
  'try {\n                              setUploadingImage(true);\n                              const fileExt = file.name.split(\'.\').pop() || \'png\';',
  `try {
                              setUploadingImage(true);
                              
                              const options = {
                                maxSizeMB: 0.8,
                                maxWidthOrHeight: 1024,
                                useWebWorker: true
                              };
                              const compressedFile = await imageCompression(file, options);
                              
                              const fileExt = compressedFile.name.split('.').pop() || 'png';
                              const fileName = \`product_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${fileExt}\`;
                              const filePath = \`\${fileName}\`;`
);

content = content.replace(
  '.upload(filePath, file, {',
  '.upload(filePath, compressedFile, {'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
