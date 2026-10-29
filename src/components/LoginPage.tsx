import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/authConfig';

export default function LoginPage() {
  const authenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const [error, setError] = useState('');
  if (authenticated) return <Navigate to="/" replace />;

  async function signIn() {
    setError('');
    try {
      await instance.loginRedirect(loginRequest);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Could not start sign-in.');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">N</div>
        <p className="eyebrow">NK REACT 26</p>
        <h1>Sign in to continue</h1>
        <p className="muted">Continue with your work or school account. Microsoft securely handles your sign-in.</p>
        <button className="full-width" onClick={signIn}>Sign in with Microsoft</button>
        {error && <p className="error" role="alert">{error}</p>}
        <p className="fine-print">Your Microsoft password is entered only on Microsoft's sign-in page.</p>
      </section>
    </main>
  );
}
