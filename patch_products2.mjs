import fs from 'fs';
let content = fs.readFileSync('src/pages/Products.tsx', 'utf8');

// Remove caching check
content = content.replace(
/const cached = sessionStorage\.getItem\('all_products'\);\n\s*if \(cached\) \{[\s\S]*?return;\n\s*\}/,
''
);

// Map products properly
content = content.replace(
/let \{ data: list, error \} = await supabase\.from\('products'\)\.select\('\*'\);\n\s*if \(error\) throw error;\n\s*if \(list && list\.length === 0\) \{[\s\S]*?\}\n\s*if \(list && list\.length > 0\) \{[\s\S]*?\}\n\s*setProducts\(list\);/m,
`let { data: list, error } = await supabase.from('products').select('*');
        if (error) throw error;
        
        // Fallback to mock products if DB has no products
        if (list && list.length === 0) {
          list = mockProducts;
        }

        if (list && list.length > 0) {
          list = list.map((p: any) => ({
            ...p,
            originalPrice: p.original_price || p.originalPrice
          }));
        }
        setProducts(list);`
);

fs.writeFileSync('src/pages/Products.tsx', content);
