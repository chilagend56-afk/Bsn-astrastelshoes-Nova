import fs from 'fs';

let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Add signup function to the interface
content = content.replace(
/login: \(email: string, password: string\) => Promise<AppUser>;/,
`login: (email: string, password: string) => Promise<AppUser>;
  signup: (email: string, password: string) => Promise<AppUser>;`
);

// Add signup implementation
const signupImpl = `  const signup = async (emailInput: string, passwordInput: string): Promise<AppUser> => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: emailInput,
      password: passwordInput,
    });
    
    if (signUpError) {
      if (signUpError.message.includes('rate limit')) {
        throw new Error("Email rate limit exceeded. Please disable Email Confirmations in Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email) to proceed.");
      }
      throw new Error(signUpError.message);
    }
    
    const sUser = signUpData.user;
    if (!sUser) throw new Error("Authentication failed for admin account.");

    const adminUser: AppUser = {
      id: sUser.id,
      role: 'admin',
      name: 'Admin',
      email: emailInput
    };

    await supabase.from('users').upsert({
      id: sUser.id,
      role: 'admin',
      name: 'Admin',
      email: emailInput
    });

    setUser(adminUser);
    localStorage.setItem('youngdangote_user', JSON.stringify(adminUser));
    return adminUser;
  };

  const login`;

content = content.replace(/const login/, signupImpl);

// Export it in context provider
content = content.replace(
/value=\{\{\n      user,\n      loading,\n      login,\n      logout\n    \}\}/,
`value={{
      user,
      loading,
      login,
      signup,
      logout
    }}`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
