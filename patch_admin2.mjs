import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Replace Firebase auth with Supabase auth
content = content.replace(
/if \(!auth\.currentUser \|\| !newAdminPassword\) return;\n    try \{\n      await updatePassword\(auth\.currentUser, newAdminPassword\);/,
`if (!newAdminPassword) return;
    try {
      const { error } = await supabase.auth.updateUser({ password: newAdminPassword });
      if (error) throw error;`
);

content = content.replace(
/if \(error\.code === 'auth\/requires-recent-login'\) \{/,
`if (error.message && error.message.includes('requires-recent-login')) {`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
