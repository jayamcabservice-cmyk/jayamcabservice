import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCommentDots } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        package: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const sectionRef = useRef(null);
    const infoRef = useRef(null);
    const formRef = useRef(null);

    const packages = [
        'Golden Triangle Tour',
        'Kerala Backwaters Tour',
        'Kashmir Paradise Tour',
        'Himachal Adventure Tour',
        'Goa Beach Holiday',
        'Rajasthan Royal Tour',
        'Custom Package',
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Phone number should be 10 digits';
        }

        if (!formData.package) {
            newErrors.package = 'Please select a package';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            alert('Thank you for your inquiry! We will contact you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                package: '',
                message: '',
            });
            setErrors({});
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Removed GSAP animations - using CSS transitions instead

    return (
        <section ref={sectionRef} id="contact" className="py-20 bg-gradient-to-br from-india-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div ref={headingRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-4">
                        Plan Your Journey
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get in touch with us to create your perfect Indian adventure
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div ref={infoRef} className="space-y-8">
                        <div className="bg-gradient-to-br from-india-blue-600 to-india-blue-800 rounded-2xl p-8 text-white">
                            <h3 className="text-3xl font-bold mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <FaPhone className="text-2xl mt-1 mr-4 text-india-saffron-400" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Phone</h4>
                                        <p className="text-white/90">+91 70305 71513</p>
                                        <p className="text-white/90">+91 87654 32109</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaEnvelope className="text-2xl mt-1 mr-4 text-india-saffron-400" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Email</h4>
                                        <p className="text-white/90">info@incredibleindiatours.com</p>
                                        <p className="text-white/90">booking@incredibleindiatours.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                                <h4 className="font-semibold mb-3">Office Hours</h4>
                                <p className="text-white/90">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                                <p className="text-white/90">Sunday: 10:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div ref={formRef}>
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="space-y-6">
                                {/* Name */}
                                <div className="form-field">
                                    <label className="flex items-center text-gray-700 font-medium mb-2">
                                        <FaUser className="mr-2 text-india-blue-600" />
                                        Name*
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500 transition-all`}
                                        placeholder="Your full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="form-field">
                                    <label className="flex items-center text-gray-700 font-medium mb-2">
                                        <FaEnvelope className="mr-2 text-india-blue-600" />
                                        Email*
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500 transition-all`}
                                        placeholder="your.email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div className="form-field">
                                    <label className="flex items-center text-gray-700 font-medium mb-2">
                                        <FaPhone className="mr-2 text-india-blue-600" />
                                        Phone*
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500 transition-all`}
                                        placeholder="10-digit mobile number"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                {/* Package Selection */}
                                <div className="form-field">
                                    <label className="text-gray-700 font-medium mb-2 block">
                                        Select Package*
                                    </label>
                                    <motion.select
                                        whileFocus={{ scale: 1.02 }}
                                        name="package"
                                        value={formData.package}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.package ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500 transition-all`}
                                    >
                                        <option value="">Choose a package...</option>
                                        {packages.map((pkg) => (
                                            <option key={pkg} value={pkg}>
                                                {pkg}
                                            </option>
                                        ))}
                                    </motion.select>
                                    {errors.package && <p className="text-red-500 text-sm mt-1">{errors.package}</p>}
                                </div>

                                {/* Message */}
                                <div className="form-field">
                                    <label className="flex items-center text-gray-700 font-medium mb-2">
                                        <FaCommentDots className="mr-2 text-india-blue-600" />
                                        Message*
                                    </label>
                                    <motion.textarea
                                        whileFocus={{ scale: 1.02 }}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-india-blue-500 transition-all resize-none`}
                                        placeholder="Tell us about your travel preferences..."
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                </div>

                                {/* Submit Button */}
                                <div className="form-field">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-india-saffron-500 to-india-saffron-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        Submit Inquiry
                                    </motion.button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
