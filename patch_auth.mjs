import fs from 'fs';

let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Replace the auto-signup logic
content = content.replace(
/if \(authError\.message\.includes\('Invalid login credentials'\) && emailInput\.toLowerCase\(\) === 'ydangote1@gmail\.com'\) \{[\s\S]*?throw new Error\(authError\.message\);\n    \}/,
`if (authError.message.includes('Invalid login credentials') && emailInput.toLowerCase() === 'ydangote1@gmail.com') {
        throw new Error("Invalid login credentials. If you haven't created this admin account yet, please sign up first. If you are locked out, you may need to disable Email Confirmations in your Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email).");
      }
      throw new Error(authError.message);
    }`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
