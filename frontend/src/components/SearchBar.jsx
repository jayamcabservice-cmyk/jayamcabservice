import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const SearchBar = () => {
    const [destination, setDestination] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const popularDestinations = [
        'Goa', 'Kerala', 'Rajasthan', 'Kashmir', 'Himachal Pradesh',
        'Uttarakhand', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Agra'
    ];

    const filteredDestinations = popularDestinations.filter(dest =>
        dest.toLowerCase().includes(destination.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full max-w-4xl mx-auto relative z-20"
        >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Destination Input */}
                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <FaMapMarkerAlt className="inline mr-2 text-india-saffron-600" />
                            Where to?
                        </label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => {
                                setDestination(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="Enter destination"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-india-blue-500 focus:outline-none text-gray-800 transition-all"
                        />

                        {/* Suggestions dropdown */}
                        <AnimatePresence>
                            {showSuggestions && destination && filteredDestinations.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-50"
                                >
                                    {filteredDestinations.map((dest, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setDestination(dest);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-india-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                            <FaMapMarkerAlt className="inline mr-2 text-india-saffron-500" />
                                            {dest}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Date Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <FaCalendarAlt className="inline mr-2 text-india-saffron-600" />
                            When?
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-india-blue-500 focus:outline-none text-gray-800 transition-all"
                        />
                    </div>

                    {/* Travelers Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Travelers
                        </label>
                        <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-india-blue-500 focus:outline-none text-gray-800 transition-all">
                            <option>1-2 People</option>
                            <option>3-5 People</option>
                            <option>6-10 People</option>
                            <option>10+ People</option>
                        </select>
                    </div>
                </div>

                {/* Search Button */}
                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255, 143, 0, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-india-saffron-500 to-india-saffron-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                >
                    <FaSearch />
                    Search Tours
                </motion.button>
            </div>

            {/* Quick Links */}
            <div className="mt-6 text-center">
                <p className="text-white/80 text-sm mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {['Goa Beach Holiday', 'Kashmir Package', 'Kerala Tour', 'Rajasthan Circuit'].map((search, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                            className="px-4 py-2 bg-white/15 backdrop-blur-sm text-white text-sm rounded-full border border-white/30 hover:border-white/50 transition-all"
                        >
                            {search}
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SearchBar;
