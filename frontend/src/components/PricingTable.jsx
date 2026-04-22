import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaChevronDown, FaRupeeSign } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const PricingTable = () => {
    const [expandedRow, setExpandedRow] = useState(1);
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const badgeRef = useIntersectionReveal('scaleIn', { delay: 0.1, duration: 0.6 });
    const rowsRef = useRef(null);
    const taxRef = useIntersectionReveal('clipReveal', { delay: 0.3, duration: 1 });

    const vehicles = [
        {
            name: 'Hatchback',
            icon: '🚗',
            seats: '4 Pax',
            bags: '2 Bags',
            pricePerKm: 9,
            minKm: 250,
            driverAllowance: 300,
            bestFor: 'Solo / Couple — short city trips',
            features: ['AC', 'Music System', 'Comfortable Seats'],
            color: '#10B981',
        },
        {
            name: 'Sedan',
            icon: '🚙',
            seats: '4 Pax',
            bags: '3 Bags',
            pricePerKm: 12,
            minKm: 250,
            driverAllowance: 300,
            bestFor: 'Couples / Small families — outstation',
            features: ['AC', 'Music System', 'Spacious Boot', 'Charging Points'],
            color: '#3B82F6',
            popular: true,
        },
        {
            name: 'SUV (6+1)',
            icon: '🚙',
            seats: '6-7 Pax',
            bags: '5 Bags',
            pricePerKm: 16,
            minKm: 250,
            driverAllowance: 400,
            bestFor: 'Families — long drives & hill stations',
            features: ['AC', 'Push Back Seats', 'Music System', 'Charging Points', 'Spacious'],
            color: '#8B5CF6',
        },
        {
            name: 'Tempo Traveller',
            icon: '🚐',
            seats: '12-17 Pax',
            bags: '10+ Bags',
            pricePerKm: 25,
            minKm: 300,
            driverAllowance: 500,
            bestFor: 'Group tours / Pilgrimages',
            features: ['AC', 'Push Back Seats', 'LED TV', 'Music System', 'Charging Points', 'Luggage Carrier'],
            color: '#F59E0B',
        },
        {
            name: 'Luxury Coach',
            icon: '🚌',
            seats: '20-35 Pax',
            bags: '20+ Bags',
            pricePerKm: 40,
            minKm: 300,
            driverAllowance: 700,
            bestFor: 'Corporate / College / Wedding trips',
            features: ['AC', 'Reclining Seats', 'LED TV', 'Wi-Fi', 'Charging Points', 'Washroom'],
            color: '#EC4899',
        },
    ];



    return (
        <section className="pt-6 pb-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-14">
                    <div ref={badgeRef} className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-green-100">
                        <FaRupeeSign className="text-xs" /> Transparent Pricing
                    </div>
                    <div ref={headingRef}>
                        <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-3">
                            No Hidden Charges
                        </h2>
                        <p className="text-base text-gray-500 max-w-lg mx-auto">
                            Clear, upfront pricing — pay only for what you ride
                        </p>
                    </div>
                </div>

                {/* ===== PRICING ROWS ===== */}
                <div ref={rowsRef} className="space-y-3 mb-16">
                    {vehicles.map((vehicle, i) => (
                        <div key={i} className="pricing-row relative">
                            {/* Main row */}
                            <motion.div
                                whileHover={{ x: 4 }}
                                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                                className={`flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${expandedRow === i
                                        ? 'border-india-blue-200 bg-white shadow-lg'
                                        : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-100'
                                    }`}
                            >
                                {/* Icon + Name */}
                                <div className="flex items-center gap-3 min-w-[140px] md:min-w-[180px]">
                                    <span className="text-3xl">{vehicle.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
                                            {vehicle.name}
                                            {vehicle.popular && (
                                                <span className="bg-india-saffron-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                    Popular
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-gray-400 text-[11px] hidden md:block">{vehicle.bestFor}</p>
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
                                    <span className="bg-gray-100 px-2.5 py-1 rounded-lg">👤 {vehicle.seats}</span>
                                    <span className="bg-gray-100 px-2.5 py-1 rounded-lg">🧳 {vehicle.bags}</span>
                                </div>

                                {/* Price */}
                                <div className="ml-auto flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-2xl md:text-3xl font-black" style={{ color: vehicle.color }}>
                                                ₹{vehicle.pricePerKm}
                                            </span>
                                            <span className="text-gray-400 text-xs">/km</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">Min {vehicle.minKm} km/day</p>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: expandedRow === i ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                    >
                                        <FaChevronDown className="text-gray-400 text-xs" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Expanded details */}
                            <AnimatePresence>
                                {expandedRow === i && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 pt-2 ml-12 md:ml-16 flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div className="flex flex-wrap gap-1.5">
                                                {vehicle.features.map((f, j) => (
                                                    <span key={j} className="text-[11px] bg-india-blue-50 text-india-blue-700 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                                                        <FaCheck className="text-green-500" style={{ fontSize: '8px' }} /> {f}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                Driver Allowance: <strong className="text-gray-600">₹{vehicle.driverAllowance}/day</strong>
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default PricingTable;
