import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const NewsletterCTA = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const sectionRef = useRef(null);
    const contentRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setEmail('');
            setIsSubmitted(false);
        }, 3000);
    };

    return (
        <section ref={sectionRef} className="py-20 relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-india-blue-600 via-india-blue-700 to-india-saffron-600"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-india-saffron-500/30 via-transparent to-india-blue-500/30 animate-pulse opacity-30" />

            {/* Decorative orbs - static */}
            <div
                ref={orb1Ref}
                className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"
            />
            <div
                ref={orb2Ref}
                className="absolute bottom-20 right-20 w-40 h-40 bg-india-saffron-400/20 rounded-full blur-3xl"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={contentRef} className="text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Get Exclusive Travel Deals
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter and receive special offers, travel tips, and destination guides
                    </p>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="flex-1 px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-india-saffron-500 text-white font-bold rounded-full hover:bg-india-saffron-600 transition-colors duration-300 shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    Subscribe <FaPaperPlane />
                                </motion.button>
                            </div>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 max-w-xl mx-auto"
                        >
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-white/90">Check your email for exclusive deals</p>
                        </motion.div>
                    )}

                    <p className="text-white/70 text-sm mt-6">
                        We respect your privacy. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterCTA;
