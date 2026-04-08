import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Packages', path: '/packages' },
        { name: 'Vehicles', path: '/vehicles' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const socialLinks = [
        { icon: <FaFacebook />, href: '#', name: 'Facebook' },
        { icon: <FaTwitter />, href: '#', name: 'Twitter' },
        { icon: <FaInstagram />, href: '#', name: 'Instagram' },
        { icon: <FaLinkedin />, href: '#', name: 'LinkedIn' },
    ];

    return (
        <footer className="bg-gradient-to-br from-india-blue-900 via-india-blue-800 to-india-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Company Info — full width on mobile */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-xl sm:text-2xl font-bold mb-3">
                            <span className="text-white">JAYAM</span>
                            <span className="text-india-saffron-400"> Travels</span>
                        </h3>
                        <p className="text-white/80 mb-4 text-sm leading-relaxed">
                            Your trusted partner for unforgettable journeys across India. Experience the magic of incredible destinations.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-india-saffron-500 transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">Quick Links</h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-white/80 hover:text-india-saffron-400 transition-colors duration-300 flex items-center group text-sm"
                                    >
                                        <span className="mr-2 group-hover:mr-3 transition-all duration-300">→</span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2 mt-2 border-t border-white/20">
                                <Link
                                    to="/admin/login"
                                    className="text-india-saffron-400 hover:text-white transition-colors duration-300 flex items-center group font-semibold text-sm"
                                >
                                    <span className="mr-2">🔒</span>
                                    Admin Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">Contact Info</h4>
                        <ul className="space-y-2.5">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-3 text-india-saffron-400 flex-shrink-0 text-sm" />
                                <span className="text-white/80 text-sm">
                                    123 Tourism Plaza, Connaught Place<br />
                                    New Delhi, India - 110001
                                </span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="mr-3 text-india-saffron-400 flex-shrink-0 text-sm" />
                                <span className="text-white/80 text-sm">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3 text-india-saffron-400 flex-shrink-0 text-sm" />
                                <span className="text-white/80 text-sm">info@tstravels.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter — full width on mobile */}
                    <div className="col-span-2 sm:col-span-1">
                        <h4 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">Newsletter</h4>
                        <p className="text-white/80 mb-3 text-sm">
                            Subscribe to get special offers and travel tips!
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-india-saffron-500 text-sm"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="px-4 py-2.5 bg-india-saffron-500 text-white font-semibold rounded-lg hover:bg-india-saffron-600 transition-colors duration-300 text-sm"
                            >
                                Subscribe
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/20 text-center">
                    <p className="text-white/90 font-medium">
                        © {currentYear} JAYAM Travels. All rights reserved.
                    </p>
                    <div className="mt-4 flex justify-center gap-3 text-sm">
                        <a href="#" className="text-white/80 hover:text-india-saffron-400 transition-colors">Privacy Policy</a>
                        <span className="text-white/40">•</span>
                        <a href="#" className="text-white/80 hover:text-india-saffron-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
