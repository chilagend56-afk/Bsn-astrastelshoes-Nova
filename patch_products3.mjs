import fs from 'fs';
let content = fs.readFileSync('src/pages/Products.tsx', 'utf8');

content = content.replace(
/let \{ data: list, error \} = await supabase\.from\('products'\)\.select\('\*'\);\n\s*if \(error\) throw error;\n\s*\/\/ Fallback to mock products if DB has no products\n\s*if \(list\.length === 0\) \{\n\s*list = mockProducts;\n\s*\} else \{\n\s*sessionStorage\.setItem\('all_products', JSON\.stringify\(list\)\);\n\s*\}\n\s*setProducts\(list\);/,
`let { data: list, error } = await supabase.from('products').select('*');
        if (error) throw error;
        
        // Fallback to mock products if DB has no products
        if (!list || list.length === 0) {
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
