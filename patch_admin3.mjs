import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Update initial state
content = content.replace(
/price: 0,/,
`price: 0,
    originalPrice: 0,`
);

// Update product payload
content = content.replace(
/price: Number\(productForm\.price\),/,
`price: Number(productForm.price),
        original_price: productForm.originalPrice ? Number(productForm.originalPrice) : null,`
);

// Update setEditingProduct mapping
content = content.replace(
/setEditingProduct\(product\);\n\s*setProductForm\(\{/,
`setEditingProduct(product);
                          setProductForm({`
);

// We need to find where editingProduct is set to populate originalPrice
content = content.replace(
/setProductForm\(\{\n\s*name: product\.name \|\| '',\n\s*brand: product\.brand \|\| '',\n\s*category: product\.category \|\| 'Smartphones',\n\s*price: product\.price \|\| 0,\n\s*image: product\.image \|\| '',\n\s*specs: product\.specs \|\| '',\n\s*note: product\.note \|\| ''\n\s*\}\);/,
`setProductForm({
                            name: product.name || '',
                            brand: product.brand || '',
                            category: product.category || 'Smartphones',
                            price: product.price || 0,
                            originalPrice: product.original_price || product.originalPrice || 0,
                            image: product.image || '',
                            specs: product.specs || '',
                            note: product.note || ''
                          });`
);

// Add the original price input in UI next to Price
content = content.replace(
/<div>\n\s*<label className="block text-sm font-medium text-gray-700">Price \(₦\)<\/label>\n\s*<input type="number" required value=\{productForm\.price\} onChange=\{e => setProductForm\(\{\.\.\.productForm, price: Number\(e\.target\.value\)\}\)\} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" \/>\n\s*<\/div>/,
`<div>
                      <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
                      <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Original Price (Optional)</label>
                      <input type="number" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: Number(e.target.value)})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary" />
                   </div>`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
