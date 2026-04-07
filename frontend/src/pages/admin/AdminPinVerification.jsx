import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaBackspace } from 'react-icons/fa';

const AdminPinVerification = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Developer-set PIN (in production, this should come from environment variables)
  const DEVELOPER_PIN = '4547'; // Change this to your desired 4-digit PIN

  // Check if already verified in session
  useEffect(() => {
    const isVerified = sessionStorage.getItem('adminPinVerified');
    if (isVerified === 'true') {
      // Redirect to where they were going or default to admin dashboard
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handlePinChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (value && index === 3) {
      const completePin = [...newPin].join('');
      if (completePin.length === 4) {
        verifyPin(completePin);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (!/^\d+$/.test(pastedData)) {
      setError('PIN must contain only numbers');
      return;
    }

    const newPin = [...pin];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    if (pastedData.length === 4) {
      verifyPin(newPin.join(''));
    }
  };

  const verifyPin = async (enteredPin) => {
    setLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    if (enteredPin === DEVELOPER_PIN) {
      // Store verification in session storage
      sessionStorage.setItem('adminPinVerified', 'true');
      
      // Redirect to admin login
      const from = location.state?.from || '/admin/login';
      navigate(from, { replace: true });
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin(['', '', '', '']);
      // Focus first input
      const firstInput = document.getElementById('pin-0');
      if (firstInput) firstInput.focus();
    }

    setLoading(false);
  };

  const handleBackspace = () => {
    const newPin = [...pin];
    // Find last non-empty index and clear it
    for (let i = 3; i >= 0; i--) {
      if (newPin[i]) {
        newPin[i] = '';
        setPin(newPin);
        const input = document.getElementById(`pin-${i}`);
        if (input) input.focus();
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-india-blue-900 via-india-blue-700 to-india-saffron-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Security Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-india-saffron-500 to-india-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <FaLock className="text-4xl text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Admin Access
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Enter your 4-digit security PIN
          </p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-center text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* PIN Input Fields */}
          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                disabled={loading}
                className={`w-14 h-16 text-center text-2xl font-bold bg-white/20 border-2 rounded-xl focus:outline-none focus:border-india-saffron-400 focus:bg-white/30 transition-all duration-200 ${
                  error 
                    ? 'border-red-500 text-red-200' 
                    : 'border-white/30 text-white placeholder-white/30'
                }`}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Clear Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleBackspace}
              disabled={loading || pin.every(d => !d)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-200 hover:scale-105"
            >
              <FaBackspace size={18} />
              Clear
            </button>
          </div>

          {/* Info Text */}
          <div className="text-center text-gray-400 text-sm">
            <p>Only authorized personnel can access</p>
            <p className="mt-1 text-xs text-gray-500">
              Contact the developer if you don't have the PIN
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/70 hover:text-white text-sm transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPinVerification;
