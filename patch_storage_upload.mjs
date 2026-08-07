import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// 1. Replace product image upload logic
const oldProductUpload = `const reader = new FileReader();
                            reader.onloadend = () => {
                              setProductForm({...productForm, image: reader.result as string});
                            };
                            reader.readAsDataURL(file);`;

const newProductUpload = `try {
                              setUploadingImage(true);
                              const fileExt = file.name.split('.').pop() || 'png';
                              const fileName = \`product_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${fileExt}\`;
                              const filePath = \`\${fileName}\`;

                              const { error: uploadError } = await supabase.storage
                                .from('product-images')
                                .upload(filePath, file, {
                                  cacheControl: '3600',
                                  upsert: false
                                });

                              if (uploadError) {
                                console.error('Supabase storage upload error:', uploadError);
                                alert('Failed to upload image: ' + uploadError.message);
                                return;
                              }

                              const { data } = supabase.storage
                                .from('product-images')
                                .getPublicUrl(filePath);

                              if (data?.publicUrl) {
                                setProductForm(prev => ({ ...prev, image: data.publicUrl }));
                              } else {
                                alert('Could not retrieve public image URL.');
                              }
                            } catch (err) {
                              console.error('Image upload failed:', err);
                              alert('Image upload failed');
                            } finally {
                              setUploadingImage(false);
                            }`;

if (content.includes(oldProductUpload)) {
  content = content.replace(oldProductUpload, newProductUpload);
  console.log('Successfully replaced product upload logic!');
} else {
  console.log('Target oldProductUpload string not found directly, checking regex...');
}

// 2. Make file input onChange async
content = content.replace(
  'onChange={(e) => {',
  'onChange={async (e) => {'
);

// 3. Replace system settings logo upload logic as well
const oldLogoUpload = `const reader = new FileReader();
                            reader.onloadend = () => {
                              setSystemSettings({...systemSettings, logoUrl: reader.result as string});
                            };
                            reader.readAsDataURL(file);`;

const newLogoUpload = `try {
                              const fileExt = file.name.split('.').pop() || 'png';
                              const fileName = \`logo_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${fileExt}\`;
                              const filePath = \`\${fileName}\`;

                              const { error: uploadError } = await supabase.storage
                                .from('product-images')
                                .upload(filePath, file, {
                                  cacheControl: '3600',
                                  upsert: false
                                });

                              if (uploadError) {
                                alert('Failed to upload logo: ' + uploadError.message);
                                return;
                              }

                              const { data } = supabase.storage
                                .from('product-images')
                                .getPublicUrl(filePath);

                              if (data?.publicUrl) {
                                setSystemSettings(prev => ({ ...prev, logoUrl: data.publicUrl }));
                              }
                            } catch (err) {
                              console.error('Logo upload failed:', err);
                            }`;

if (content.includes(oldLogoUpload)) {
  content = content.replace(oldLogoUpload, newLogoUpload);
  console.log('Successfully replaced logo upload logic!');
}

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
