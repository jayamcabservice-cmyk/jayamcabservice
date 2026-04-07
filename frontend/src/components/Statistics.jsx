import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaGlobeAsia, FaStar, FaAward } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const Statistics = () => {
    const sectionRef = useRef(null);
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const [hasAnimated, setHasAnimated] = useState(false);
    const [counts, setCounts] = useState({
        travelers: 0,
        destinations: 0,
        rating: 0,
        awards: 0,
    });

    const stats = [
        {
            id: 1,
            icon: <FaUsers className="text-5xl text-white" />,
            end: 10000,
            suffix: '+',
            label: 'Happy Travelers',
            key: 'travelers'
        },
        {
            id: 2,
            icon: <FaGlobeAsia className="text-5xl text-white" />,
            end: 50,
            suffix: '+',
            label: 'Destinations',
            key: 'destinations'
        },
        {
            id: 3,
            icon: <FaStar className="text-5xl text-white" />,
            end: 4.8,
            suffix: '/5',
            label: 'Average Rating',
            key: 'rating',
            decimals: 1
        },
        {
            id: 4,
            icon: <FaAward className="text-5xl text-white" />,
            end: 15,
            suffix: '+',
            label: 'Awards Won',
            key: 'awards'
        },
    ];

    // Removed GSAP animations - using CSS transitions and Framer Motion instead

    return (
        <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-gray-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={headingRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Our Achievements
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Numbers that speak for our excellence
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="stat-card text-center group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-center mb-4"
                            >
                                {stat.icon}
                            </motion.div>
                            <div className="text-5xl font-bold text-white mb-2">
                                {counts[stat.key].toLocaleString()}{stat.suffix}
                            </div>
                            <p className="text-xl text-white/90">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
