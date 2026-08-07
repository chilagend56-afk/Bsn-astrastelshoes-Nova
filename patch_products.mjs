import fs from 'fs';
let content = fs.readFileSync('src/pages/Products.tsx', 'utf8');

// Remove caching check
content = content.replace(
/const cached = sessionStorage\.getItem\('all_products'\);\n\s*if \(cached\) \{[\s\S]*?return;\n\s*\}/,
''
);

content = content.replace(
/if \(list && list\.length > 0\) \{\n\s*setProducts\(list\);\n\s*sessionStorage\.setItem\('all_products', JSON\.stringify\(list\)\);\n\s*\}/,
`if (list && list.length > 0) {
          const mapped = list.map((p: any) => ({
            ...p,
            originalPrice: p.original_price
          }));
          setProducts(mapped);
        }`
);

fs.writeFileSync('src/pages/Products.tsx', content);
