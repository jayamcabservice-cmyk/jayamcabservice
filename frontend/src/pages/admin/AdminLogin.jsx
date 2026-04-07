import React, { useState } from 'react';
import { loginWithEmail, loginWithGoogle, loginWithPhone, registerWithEmail } from '../../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend-controlled authentication - just send credentials
      const result = await loginWithEmail(formData.email, formData.password);
      
      if (result.success) {
        // Token is already stored in auth service
        navigate('/admin');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (err) {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginWithPhone(formData.phoneNumber);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Phone login failed');
      }
    } catch (err) {
      setError('Phone login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend-controlled registration
      const result = await registerWithEmail(formData.email, formData.password, formData.name);
      
      if (result.success) {
        setIsSignUp(false);
        setError('Registration successful! Please sign in.');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper min-h-screen">
      <div className={`container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
        <div className="row flex-col lg:flex-row">
          <div className="content-row w-full lg:w-1/2">
            <div className="col sign-in p-4 sm:p-6">
              <div className="text sign-in text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-sm sm:text-base text-gray-600">Sign in to manage your travel platform</p>
              </div>
              <div className="img sign-in mt-4 sm:mt-6 flex justify-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3407/3407026.png" 
                  alt="Travel Management" 
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
                />
              </div>
            </div>

            <div className="col sign-up p-4 sm:p-6">
              <div className="text sign-up text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Join Us</h2>
                <p className="text-sm sm:text-base text-gray-600">Register to manage your travel platform</p>
              </div>
              <div className="img sign-up mt-4 sm:mt-6 flex justify-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3407/3407026.png" 
                  alt="Register Management" 
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="col sign-up align-items-center w-full lg:w-1/2 p-4 sm:p-6 lg:p-8">
            <div className="form-wrapper w-full max-w-md mx-auto">
              <form onSubmit={handleRegister} className="form sign-up">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">Register Admin</h2>
                <div className="input-group mb-4">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500"
                  />
                </div>
                <div className="input-group mb-4">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500"
                  />
                </div>
                <div className="input-group mb-4">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-india-blue-600 text-white font-semibold rounded-lg hover:bg-india-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="text-center mt-4 text-sm">
                  Already have an account? <span className="pointer text-india-blue-600 font-semibold cursor-pointer" onClick={() => setIsSignUp(false)}>Sign In</span>
                </p>
                <p className="text-center mt-2 text-sm">
                  <Link to="/" className="pointer text-india-blue-600 font-semibold cursor-pointer">← Back to Home</Link>
                </p>
              </form>
            </div>
          </div>

          <div className="col sign-in align-items-center w-full lg:w-1/2 p-4 sm:p-6 lg:p-8">
            <div className="form-wrapper w-full max-w-md mx-auto">
              <div className="social-list sign-in flex justify-center gap-3 sm:gap-4 mb-6">
                <div 
                  className={`pointer p-3 sm:p-4 rounded-full ${loginMethod === 'email' ? 'active-tab bg-india-blue-100' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setLoginMethod('email')}
                >
                  <i className="fas fa-envelope text-lg sm:text-xl"></i>
                </div>
                {/* Google login disabled - Enable in Firebase Console first */}
                {/* <div 
                  className={`pointer p-3 sm:p-4 rounded-full ${loginMethod === 'google' ? 'active-tab bg-india-blue-100' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setLoginMethod('google')}
                >
                  <i className="fab fa-google text-lg sm:text-xl"></i>
                </div> */}
                <div 
                  className={`pointer p-3 sm:p-4 rounded-full ${loginMethod === 'phone' ? 'active-tab bg-india-blue-100' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setLoginMethod('phone')}
                >
                  <i className="fas fa-phone text-lg sm:text-xl"></i>
                </div>
              </div>

              {error && (
                <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {loginMethod === 'email' && (
                <form onSubmit={handleEmailLogin} className="form sign-in">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">Sign In with Email</h2>
                  
                  <div className="input-group mb-4">
                    <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500"
                    />
                  </div>

                  <div className="input-group mb-6">
                    <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-india-blue-600 text-white font-semibold rounded-lg hover:bg-india-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <p className="text-center mt-4 text-sm">
                    Don't have an account? <span className="pointer text-india-blue-600 font-semibold cursor-pointer" onClick={() => setIsSignUp(true)}>Register</span>
                  </p>
                  <p className="text-center mt-2 text-sm">
                    <Link to="/" className="pointer text-india-blue-600 font-semibold cursor-pointer">← Back to Home</Link>
                  </p>
                </form>
              )}

              {/* Google login form commented out - Enable in Firebase Console first */}
              {/* {loginMethod === 'google' && (
                <form className="form sign-in">
                  <h2>Sign In with Google</h2>
                  
                  <button 
                    type="button" 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="google-btn"
                  >
                    <i className="fab fa-google"></i> Sign in with Google
                  </button>

                  <p>
                    Don't have an account? <span className="pointer" onClick={() => setIsSignUp(true)}>Register</span>
                  </p>
                  <p>
                    <Link to="/" className="pointer">← Back to Home</Link>
                  </p>
                </form>
              )} */}

              {loginMethod === 'phone' && (
                <form onSubmit={handlePhoneLogin} className="form sign-in">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">Sign In with Phone</h2>
                  
                  <div className="input-group mb-6">
                    <i className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="Phone Number"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-india-blue-600 text-white font-semibold rounded-lg hover:bg-india-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <p className="text-center mt-4 text-sm">
                    Don't have an account? <span className="pointer text-india-blue-600 font-semibold cursor-pointer" onClick={() => setIsSignUp(true)}>Register</span>
                  </p>
                  <p className="text-center mt-2 text-sm">
                    <Link to="/" className="pointer text-india-blue-600 font-semibold cursor-pointer">← Back to Home</Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
