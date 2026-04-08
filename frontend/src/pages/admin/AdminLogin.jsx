import React, { useState } from 'react';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

/* ─── Official Google "G" SVG logo ─── */
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ── Email login ── */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const result = await loginWithEmail(formData.email, formData.password);
      if (result.success) navigate('/admin');
      else setError(result.error || 'Login failed. Please check your credentials.');
    } catch { setError('An unexpected error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  /* ── Google login ── */
  const handleGoogleLogin = async () => {
    setError(''); setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) navigate('/admin');
      else setError(result.error || 'Google sign-in failed. Make sure it is enabled.');
    } catch { setError('Google sign-in failed. Please try again.'); }
    finally { setGoogleLoading(false); }
  };

  /* ── Register ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const result = await registerWithEmail(formData.email, formData.password, formData.name);
      if (result.success) {
        setIsSignUp(false);
        setError('Registration successful! Please sign in.');
      } else setError(result.error || 'Registration failed');
    } catch { setError('An unexpected error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <div className={`container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
        <div className="row">

          {/* ── Branding overlay (absolute, left half) ── */}
          <div className="content-row">
            {/* Sign-in branding */}
            <div className="col">
              <div className="text sign-in">
                <h2>Welcome Back!</h2>
                <p>Sign in to manage your travel platform</p>
              </div>
              <div className="img sign-in">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3407/3407026.png"
                  alt="Travel Management"
                />
              </div>
            </div>
            {/* Sign-up branding */}
            <div className="col">
              <div className="text sign-up">
                <h2>Join Us</h2>
                <p>Register to manage your travel platform</p>
              </div>
              <div className="img sign-up">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3407/3407026.png"
                  alt="Register"
                />
              </div>
            </div>
          </div>

          {/* ── SIGN-UP form (right half when sign-up active) ── */}
          <div className="col sign-up align-items-center">
            <div className="form-wrapper">
              <form onSubmit={handleRegister} className="form sign-up">
                <h2>Create Account</h2>
                <p className="form-subtitle">Register as an admin</p>

                {error && isSignUp && (
                  <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                    {error}
                  </div>
                )}

                {/* Google button */}
                <button
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                >
                  <GoogleLogo />
                  {googleLoading ? 'Connecting...' : 'Continue with Google'}
                </button>

                <div className="or-divider">
                  <span>or</span>
                </div>

                <div className="input-group">
                  <i className="fas fa-user" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                  />
                </div>
                <div className="input-group">
                  <i className="fas fa-envelope" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email address"
                  />
                </div>
                <div className="input-group">
                  <i className="fas fa-lock" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create password"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading || googleLoading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="switch-link">
                  Already have an account?{' '}
                  <span className="pointer" onClick={() => { setIsSignUp(false); setError(''); }}>
                    Sign In
                  </span>
                </p>
                <p className="switch-link">
                  <Link to="/" className="pointer">← Back to Home</Link>
                </p>
              </form>
            </div>
          </div>

          {/* ── SIGN-IN form (right half when sign-in active) ── */}
          <div className="col sign-in align-items-center">
            <div className="form-wrapper">
              <form onSubmit={handleEmailLogin} className="form sign-in">
                <h2>Sign In</h2>
                <p className="form-subtitle">Welcome back, Admin</p>

                {error && !isSignUp && (
                  <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                    {error}
                  </div>
                )}

                {/* Google button */}
                <button
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                >
                  <GoogleLogo />
                  {googleLoading ? 'Connecting...' : 'Continue with Google'}
                </button>

                <div className="or-divider">
                  <span>or</span>
                </div>

                <div className="input-group">
                  <i className="fas fa-envelope" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email address"
                  />
                </div>
                <div className="input-group">
                  <i className="fas fa-lock" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading || googleLoading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="switch-link">
                  Don't have an account?{' '}
                  <span className="pointer" onClick={() => { setIsSignUp(true); setError(''); }}>
                    Register
                  </span>
                </p>
                <p className="switch-link">
                  <Link to="/" className="pointer">← Back to Home</Link>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
