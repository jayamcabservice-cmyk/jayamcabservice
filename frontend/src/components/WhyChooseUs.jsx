import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHeadset, FaMapMarkedAlt, FaUsers } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const WhyChooseUs = () => {
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const gridRef = useIntersectionReveal('staggerUp', { stagger: 0.12, start: 'top 80%' });

    const features = [
        {
            id: 1,
            icon: <FaCheckCircle className="text-5xl text-india-saffron-500" />,
            title: 'Best Price Guarantee',
            description: 'We offer the most competitive prices for all our tour packages without compromising quality.',
        },
        {
            id: 2,
            icon: <FaHeadset className="text-5xl text-india-saffron-500" />,
            title: '24/7 Support',
            description: 'Our dedicated team is available round the clock to assist you throughout your journey.',
        },
        {
            id: 3,
            icon: <FaMapMarkedAlt className="text-5xl text-india-saffron-500" />,
            title: 'Custom Itineraries',
            description: 'Personalized travel plans tailored to your preferences and requirements.',
        },
        {
            id: 4,
            icon: <FaUsers className="text-5xl text-india-saffron-500" />,
            title: 'Trusted by 10,000+ Travelers',
            description: 'Join thousands of satisfied travelers who have experienced India with us.',
        },
    ];

    return (
        <section id="about" className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div ref={headingRef} className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-india-blue-800 mb-3">
                        Why Choose Us
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Your trusted partner for unforgettable journeys across India
                    </p>
                </div>

                {/* Features Grid — 2 cols on mobile, 4 on desktop */}
                <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-center mb-3"
                            >
                                {/* Smaller icon on mobile */}
                                <span className="text-3xl sm:text-4xl lg:text-5xl text-india-saffron-500">
                                    {feature.icon}
                                </span>
                            </motion.div>
                            <h3 className="text-sm sm:text-base lg:text-xl font-bold text-india-blue-800 mb-2 group-hover:text-india-blue-600 transition-colors leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed hidden sm:block">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
