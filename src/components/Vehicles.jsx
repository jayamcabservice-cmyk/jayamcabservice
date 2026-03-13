import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSuitcase, FaSnowflake, FaWifi, FaBolt, FaCoffee } from 'react-icons/fa';
import { fetchVehicles } from '../services/api';
import useGsapReveal from '../hooks/useGsapReveal';

const Vehicles = () => {
    const [filter, setFilter] = useState('all');
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        fetchVehicles()
            .then(data => {
                // Enrich with display defaults since DB only stores basics
                setVehicles(data.filter(v => v.status !== 'maintenance').map(v => ({
                    ...v,
                    bestFor: [],
                    amenities: ['AC', 'Music System', 'Comfortable Seats'],
                    icon: v.category === 'small' ? '🚗' : v.category === 'family' ? '🚙' : v.category === 'group' ? '🚐' : '🚌',
                    routes: [],
                })));
            })
            .catch(() => { });
    }, []);


    const filters = [
        { name: 'All Vehicles', value: 'all' },
        { name: 'Small Group (1-4)', value: 'small' },
        { name: 'Family (5-7)', value: 'family' },
        { name: 'Group (10-20)', value: 'group' },
        { name: 'Large Group (20+)', value: 'large' },
    ];

    const filteredVehicles = filter === 'all' ? vehicles : vehicles.filter(v => v.category === filter);


    const headerRef = useGsapReveal('fadeUp', { duration: 0.8 });
    const filtersRef = useGsapReveal('fadeUp', { delay: 0.2 });
    const gridRef = useGsapReveal('staggerUp', { children: true, delay: 0.1 });
    const infoRef = useGsapReveal('scaleIn', { delay: 0.3 });

    return (
        <section id="vehicles" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-4">
                        Choose Your Perfect Ride
                        <span className="block text-2xl md:text-3xl text-india-saffron-600 mt-2">
                            आपली योग्य वाहन निवडा
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From solo adventures to large group tours, we have the perfect vehicle for every journey across India
                    </p>
                </div>

                {/* Filter Buttons */}
                <div
                    ref={filtersRef}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    {filters.map((item) => (
                        <motion.button
                            key={item.value}
                            onClick={() => setFilter(item.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${filter === item.value
                                ? 'bg-gradient-to-r from-india-blue-600 to-india-blue-700 text-white shadow-xl scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                                }`}
                        >
                            {item.name}
                        </motion.button>
                    ))}
                </div>

                {/* Vehicles Grid */}
                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredVehicles.map((vehicle, index) => (
                        <div
                            key={vehicle.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
                        >
                            {/* Image Section */}
                            <div className="relative h-64 overflow-hidden">
                                <motion.img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-all duration-700"
                                    whileHover={{ scale: 1.1 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                {/* Vehicle Icon Badge */}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                    <span className="text-3xl">{vehicle.icon}</span>
                                </div>

                                {/* Price Badge */}
                                <div className="absolute bottom-4 left-4">
                                    <div className="bg-india-saffron-500 text-white px-4 py-2 rounded-full shadow-lg">
                                        <span className="font-bold text-lg">{vehicle.pricePerKm}</span>
                                        <span className="text-sm ml-1">/km</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-india-blue-800">{vehicle.name}</h3>
                                        <p className="text-gray-600 text-sm">{vehicle.model}</p>
                                    </div>
                                </div>

                                {/* Capacity Info */}
                                <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-india-blue-600 text-xl" />
                                        <span className="text-gray-700 font-medium">{vehicle.seating}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaSuitcase className="text-india-saffron-600 text-xl" />
                                        <span className="text-gray-700 font-medium">{vehicle.luggage}</span>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Amenities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vehicle.amenities.map((amenity, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-india-blue-50 text-india-blue-700 text-xs font-medium rounded-full border border-india-blue-100"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Best For */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Best For</h4>
                                    <ul className="space-y-2">
                                        {vehicle.bestFor.map((purpose, i) => (
                                            <li key={i} className="flex items-center text-gray-600 text-sm">
                                                <span className="w-1.5 h-1.5 bg-india-saffron-500 rounded-full mr-2"></span>
                                                {purpose}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Popular Routes */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Popular Routes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vehicle.routes.map((route, i) => (
                                            <span
                                                key={i}
                                                className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                                            >
                                                {route}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Book Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(255, 143, 0, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-3 bg-gradient-to-r from-india-saffron-500 to-india-saffron-600 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    Get Quote for {vehicle.name}
                                </motion.button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <div
                    ref={infoRef}
                    className="mt-20 bg-gradient-to-br from-india-blue-50 to-india-saffron-50 rounded-3xl p-8 md:p-12"
                >
                    <h3 className="text-3xl font-bold text-india-blue-800 mb-6 text-center">
                        Why Choose Our Vehicles?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-india-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCoffee className="text-white text-2xl" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-800 mb-2">Well Maintained</h4>
                            <p className="text-gray-600 text-sm">All vehicles are regularly serviced and kept in pristine condition</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-india-saffron-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaBolt className="text-white text-2xl" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-800 mb-2">Experienced Drivers</h4>
                            <p className="text-gray-600 text-sm">Professional drivers with extensive knowledge of routes and safety</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-india-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaSnowflake className="text-white text-2xl" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-800 mb-2">24/7 Support</h4>
                            <p className="text-gray-600 text-sm">Round-the-clock assistance for a smooth and comfortable journey</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Vehicles;
