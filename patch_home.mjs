import fs from 'fs';
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Remove caching check
content = content.replace(
/const cached = sessionStorage\.getItem\('home_products'\);\n\s*if \(cached\) \{[\s\S]*?return;\n\s*\}/,
''
);

// Map product fields correctly (original_price -> originalPrice)
content = content.replace(
/if \(fetched && fetched\.length > 0\) \{\n\s*setProducts\(fetched\);\n\s*sessionStorage\.setItem\('home_products', JSON\.stringify\(fetched\)\);\n\s*\}/,
`if (fetched && fetched.length > 0) {
          const mapped = fetched.map(p => ({
            ...p,
            originalPrice: p.original_price
          }));
          setProducts(mapped);
        }`
);

fs.writeFileSync('src/pages/Home.tsx', content);
