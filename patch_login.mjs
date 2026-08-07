import fs from 'fs';

let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');

// Add signup from context
content = content.replace(
/const \{ login, resetPassword \} = useAuth\(\);/,
`const { login, signup, resetPassword } = useAuth();`
);

// Add handleSignup function
content = content.replace(
/const handleLogin/,
`const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);
    try {
      const loggedInUser = await signup(email, password);
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin`
);

// Add signup button
content = content.replace(
/\{loading \? 'Signing in\.\.\.' : 'Sign in'\}\n              <\/button>\n            <\/div>/,
`{loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignup}
                disabled={loading}
                className="text-primary hover:text-primary-light font-medium"
              >
                Sign up
              </button>
            </div>`
);

fs.writeFileSync('src/pages/Login.tsx', content);
