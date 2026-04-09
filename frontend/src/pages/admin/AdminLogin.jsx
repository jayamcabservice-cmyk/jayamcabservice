import React, { useState } from 'react';
import { loginWithEmail, resetAdminPassword } from '../../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ── Email login ── */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    setMessage('');
    setLoading(true);
    try {
      const result = await loginWithEmail(formData.email, formData.password);
      if (result.success) navigate('/admin');
      else setError(result.error || 'Login failed. Please check your credentials.');
    } catch { setError('An unexpected error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  /* ── Forgot Password ── */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!formData.email) {
      setError('Please enter your email first.');
      return;
    }

    setLoading(true);
    try {
      const result = await resetAdminPassword(formData.email);
      if (result.success) {
        setMessage('Password reset link has been sent to your email.');
      } else {
        setError(result.error || 'Failed to send reset email.');
      }
    } catch { 
      setError('An unexpected error occurred.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="auth-wrapper">
      {/* We reuse the "sign-up" class for the sliding animation to show the forgot password pane */}
      <div className={`container ${isForgotPassword ? 'sign-up' : 'sign-in'}`}>
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
            {/* Forgot Password branding (Reusing sign-up CSS class) */}
            <div className="col">
              <div className="text sign-up">
                <h2>Reset Password</h2>
                <p>Get a secure link to reset your access</p>
              </div>
              <div className="img sign-up">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3407/3407026.png"
                  alt="Reset Password"
                />
              </div>
            </div>
          </div>

          {/* ── FORGOT PASSWORD form (right half when active, reusing sign-up class) ── */}
          <div className="col sign-up align-items-center">
            <div className="form-wrapper">
              <form onSubmit={handleForgotPassword} className="form sign-up">
                <h2>Recover Access</h2>
                <p className="form-subtitle">We'll send you a secure reset link</p>

                {error && isForgotPassword && (
                  <div className="alert alert-error">{error}</div>
                )}
                {message && isForgotPassword && (
                  <div className="alert alert-success">{message}</div>
                )}

                <div className="input-group">
                  <i className="fas fa-envelope" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending link...' : 'Send Reset Link'}
                </button>

                <p className="switch-link">
                  Remember your password?{' '}
                  <span className="pointer" onClick={() => { setIsForgotPassword(false); setError(''); setMessage(''); }}>
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

                {error && !isForgotPassword && (
                  <div className="alert alert-error">{error}</div>
                )}
                {message && !isForgotPassword && (
                  <div className="alert alert-success">{message}</div>
                )}

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
                <div className="input-group" style={{ position: 'relative' }}>
                  <i className="fas fa-lock" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    style={{ paddingRight: '40px' }}
                  />
                  <i 
                    className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} 
                    style={{ position: 'absolute', right: '15px', left: 'auto', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', zIndex: 10 }}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide Password" : "Show Password"}
                  />
                </div>

                <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                  <span 
                    className="pointer" 
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => { setIsForgotPassword(true); setError(''); setMessage(''); }}
                  >
                    Forgot Password?
                  </span>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="switch-link" style={{ marginTop: '2rem' }}>
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
