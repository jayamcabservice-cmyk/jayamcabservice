import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaRoad, FaArrowRight, FaRoute } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const PopularRoutes = () => {
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const badgeRef = useIntersectionReveal('scaleIn', { delay: 0.1, duration: 0.6 });
    const gridRef = useRef(null);

    const routes = [
        {
            from: 'Nashik',
            to: 'Pune',
            distance: '210 km',
            duration: '3.5-4 hrs',
            price: '₹2,499',
            image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=400&auto=format&fit=crop',
            tag: 'Popular',
            color: '#3B82F6',
        },
        {
            from: 'Nashik',
            to: 'Mumbai',
            distance: '167 km',
            duration: '3-3.5 hrs',
            price: '₹2,199',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=400&auto=format&fit=crop',
            tag: 'Business',
            color: '#8B5CF6',
        },
        {
            from: 'Nashik',
            to: 'Shirdi',
            distance: '90 km',
            duration: '1.5-2 hrs',
            price: '₹1,299',
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=400&auto=format&fit=crop',
            tag: 'Pilgrimage',
            color: '#F59E0B',
        },
        {
            from: 'Nashik',
            to: 'Aurangabad',
            distance: '190 km',
            duration: '3.5-4 hrs',
            price: '₹2,399',
            image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&auto=format&fit=crop',
            tag: 'Heritage',
            color: '#EC4899',
        },
        {
            from: 'Nashik',
            to: 'Lonavala',
            distance: '260 km',
            duration: '4.5-5 hrs',
            price: '₹3,199',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=400&auto=format&fit=crop',
            tag: 'Hill Station',
            color: '#10B981',
        },
        {
            from: 'Nashik',
            to: 'Mahabaleshwar',
            distance: '310 km',
            duration: '6-7 hrs',
            price: '₹3,999',
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=400&auto=format&fit=crop',
            tag: 'Nature',
            color: '#06B6D4',
        },
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-14">
                    <div ref={badgeRef} className="inline-flex items-center gap-2 bg-india-blue-50 text-india-blue-600 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 border border-india-blue-100">
                        <FaRoute className="text-xs" /> Popular Routes
                    </div>
                    <div ref={headingRef}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-india-blue-800 mb-2 sm:mb-3">
                            Popular Routes from Nashik
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
                            Most booked cab routes from Nashik with transparent pricing
                        </p>
                    </div>
                </div>

                {/* Routes Grid — 1 col mobile, 2 tablet, 3 desktop */}
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {routes.map((route, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -6 }}
                            className="route-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 group cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-36 sm:h-44 overflow-hidden">
                                <img
                                    src={route.image}
                                    alt={`${route.from} to ${route.to}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                {/* Tag */}
                                <span
                                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white"
                                    style={{ backgroundColor: route.color }}
                                >
                                    {route.tag}
                                </span>

                                {/* Route name overlay */}
                                <div className="absolute bottom-3 left-4 right-4">
                                    <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                                        {route.from}
                                        <FaArrowRight className="text-india-saffron-400 text-sm" />
                                        {route.to}
                                    </h3>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <FaRoad className="text-india-blue-500" />
                                            {route.distance}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaClock className="text-india-saffron-500" />
                                            {route.duration}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 text-xs">Starting from</span>
                                        <div className="text-india-blue-800 font-bold text-lg sm:text-xl">
                                            {route.price}
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 sm:px-5 py-2 bg-gradient-to-r from-india-saffron-500 to-india-saffron-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all min-h-[36px]"
                                    >
                                        Book Now
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularRoutes;
