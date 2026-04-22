import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useIntersectionReveal from '../hooks/useIntersectionReveal';
import { fetchPackages } from '../services/api';
import { useDataSync } from '../hooks/useDataSync';

const TourPackages = React.memo(({ preview = false, showHardcoded = false, type = 'maharashtra' }) => {
    const sectionRef = useRef(null);
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const filterRef = useIntersectionReveal('fadeUp', { delay: 0.2, duration: 0.6 });
    const [filter, setFilter] = useState('all');
    const [packages, setPackages] = useState([]);
    const [pkgLoading, setPkgLoading] = useState(true);

    // Hardcoded popular Maharashtra routes
    const maharashtraRoutes = [
        {
            id: 'mh-1',
            title: 'Nashik - Mumbai Route',
            location: 'Maharashtra',
            duration: '2 Days / 1 Night',
            price: '₹3,999',
            emoji: '🚗',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop',
            category: 'adventure',
            description: 'Explore the spiritual capital and financial hub',
        },
        {
            id: 'mh-2',
            title: 'Nashik - Pune Express',
            location: 'Maharashtra',
            duration: '2 Days / 1 Night',
            price: '₹4,499',
            emoji: '🚌',
            image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=800&auto=format&fit=crop',
            category: 'adventure',
            description: 'Wine country to cultural capital journey',
        },
        {
            id: 'mh-3',
            title: 'Konkan Darshan Special',
            location: 'Konkan Region, Maharashtra',
            duration: '5 Days / 4 Nights',
            price: '₹12,999',
            emoji: '🏖️',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
            category: 'beach',
            description: 'Complete coastal experience with beaches & forts',
        },
        {
            id: 'mh-4',
            title: 'Mumbai - Pune - Lonavala',
            location: 'Maharashtra Golden Triangle',
            duration: '3 Days / 2 Nights',
            price: '₹7,999',
            emoji: '🏞️',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
            category: 'mountain',
            description: 'City lights, hill stations & scenic expressway',
        },
        {
            id: 'mh-5',
            title: 'Ajanta Ellora Heritage Tour',
            location: 'Aurangabad, Maharashtra',
            duration: '2 Days / 1 Night',
            price: '₹6,499',
            emoji: '🏛️',
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop',
            category: 'heritage',
            description: 'UNESCO World Heritage ancient cave temples',
        },
        {
            id: 'mh-6',
            title: 'Mahabaleshwar Panchgani Hill Escape',
            location: 'Satara, Maharashtra',
            duration: '3 Days / 2 Nights',
            price: '₹8,999',
            emoji: '🍓',
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop',
            category: 'mountain',
            description: 'Strawberry farms, viewpoints & serene lakes',
        },
    ];

    // Hardcoded India Tour Packages (different states)
    const indiaPackages = [
        {
            id: 'ind-1',
            title: 'Incredible Delhi - Agra - Jaipur',
            location: 'North India (Delhi, UP, Rajasthan)',
            duration: '6 Days / 5 Nights',
            price: '₹18,999',
            emoji: '🕌',
            image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop',
            category: 'heritage',
            description: 'Golden Triangle tour with Taj Mahal & royal palaces',
        },
        {
            id: 'ind-2',
            title: 'Kerala Backwaters & Hills',
            location: 'South India (Kerala)',
            duration: '5 Days / 4 Nights',
            price: '₹16,499',
            emoji: '🌴',
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
            category: 'beach',
            description: 'Houseboat stay in Alleppey & Munnar tea gardens',
        },
        {
            id: 'ind-3',
            title: 'Goa Beach Hopping Adventure',
            location: 'West India (Goa)',
            duration: '4 Days / 3 Nights',
            price: '₹11,999',
            emoji: '🏖️',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
            category: 'beach',
            description: 'North & South Goa beaches, water sports & nightlife',
        },
        {
            id: 'ind-4',
            title: 'Kashmir Paradise Tour',
            location: 'North India (Jammu & Kashmir)',
            duration: '6 Days / 5 Nights',
            price: '₹24,999',
            emoji: '🏔️',
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop',
            category: 'mountain',
            description: 'Srinagar, Gulmarg, Pahalgam valleys & gardens',
        },
        {
            id: 'ind-5',
            title: 'Rajasthan Royal Experience',
            location: 'North India (Rajasthan)',
            duration: '7 Days / 6 Nights',
            price: '₹21,999',
            emoji: '👑',
            image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop',
            category: 'heritage',
            description: 'Jaipur, Udaipur, Jodhpur - forts, palaces & culture',
        },
        {
            id: 'ind-6',
            title: 'Himachal Himalayan Circuit',
            location: 'North India (Himachal Pradesh)',
            duration: '6 Days / 5 Nights',
            price: '₹19,999',
            emoji: '⛰️',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
            category: 'mountain',
            description: 'Manali, Shimla, Dharamshala - adventure & serenity',
        },
    ];

    // Defined outside useEffect so it can be reused by polling/broadcast
    const loadPackages = async () => {
        try {
            const data = await fetchPackages();
            const list = Array.isArray(data) ? data : (data.packages || []);

            const normalizedPackages = list.map(pkg => ({
                ...pkg,
                image: pkg.image || pkg.imageUrl,
                duration: pkg.duration || 'N/A',
                emoji: pkg.emoji || '🗺️',
                description: pkg.description || '',
            }));

            const activePackages = normalizedPackages.filter(p => p.status === 'active' || !p.status);
            setPackages(activePackages);
            setPkgLoading(false);
        } catch (error) {
            console.error('❌ Failed to load packages:', error);
            setPkgLoading(false);
        }
    };

    // Fetch packages on mount
    useEffect(() => {
        loadPackages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Real-time sync: polls every 30s + instant on admin broadcast ──
    useDataSync(loadPackages, 'packages', 30_000);

    const filters = [
        { name: 'All Packages', value: 'all' },
        { name: 'Local', value: 'local' },
        { name: 'All India Tours', value: 'all_india' },
    ];

    const filteredPackages = filter === 'all'
        ? packages
        : packages.filter(pkg => pkg.category === filter);

    // Debug: Log renders only in development
    if (process.env.NODE_ENV === 'development') {
        console.log('🎨 TourPackages RENDER - packages count:', packages.length, 'filtered count:', filteredPackages.length);
    }

    // Framer Motion variants for package cards
    const cardVariants = {
        hidden: { opacity: 0, y: 60, rotateX: -10 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    };

    return (
        <section ref={sectionRef} id="packages" className="py-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div ref={headingRef} className="text-center mb-8 sm:mb-10">
                    <h2 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-india-blue-800 mb-3 sm:mb-4 px-2">
                        {type === 'maharashtra' ? 'Popular Maharashtra Routes' : 'India Tour Packages'}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-3 leading-relaxed">
                        {type === 'maharashtra'
                            ? 'Most booked local travel routes and tour packages within Maharashtra'
                            : 'Experience the best of India with our carefully curated tour packages across different states'}
                    </p>
                    {!showHardcoded && (
                        <p className="mt-4 text-sm font-semibold text-red-600 bg-red-50 py-1.5 px-4 rounded-full border border-red-100 inline-block">
                            * Packages are customizable to your choice. Send an enquiry!
                        </p>
                    )}
                </div>

                {/* Backend Packages - Always show these on non-hardcoded pages */}
                {!showHardcoded && (
                    <>
                        {/* Filter Buttons */}
                        <div ref={filterRef} className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12 px-2">
                            {filters.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${filter === f.value
                                            ? 'bg-india-blue-600 text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                                        }`}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>

                        {/* Loading State */}
                        {pkgLoading && (
                            <div className="text-center py-10 sm:py-12">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-india-blue-600"></div>
                                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading amazing destinations...</p>
                            </div>
                        )}

                        {/* Packages Grid */}
                        {!pkgLoading && filteredPackages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {filteredPackages.map((pkg, idx) => (
                                    <motion.div
                                        key={pkg.id || idx}
                                        /* initial={{ opacity: 0, y: 50 }} */
                                        /* whileInView={{ opacity: 1, y: 0 }} */
                                        /* viewport={{ once: true }} */
                                        /* transition={{ duration: 0.6, delay: idx * 0.1 }} */
                                        whileHover={{ y: -15 }}
                                        className="package-card bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative"
                                    >
                                        {/* Image */}
                                        <div className="relative h-40 sm:h-48 md:h-52 [perspective:1000px] group/img z-20">
                                            <div className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] group-hover/img:[transform:rotateY(180deg)]">
                                                {/* Front Face */}
                                                <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden">
                                                    <motion.img
                                                        src={pkg.image}
                                                        alt={pkg.title}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>


                                                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                                                        <span className="text-white/90 text-xs sm:text-sm font-medium bg-india-blue-600/80 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full shadow-lg">
                                                            {pkg.duration}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Back Face */}
                                                <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-gradient-to-br from-india-blue-800 to-india-blue-900 border-b-4 border-india-saffron-500 text-white p-4 sm:p-6 flex flex-col justify-center items-center text-center shadow-inner overflow-hidden">

                                                    <p className="text-xs sm:text-sm leading-relaxed text-gray-100 overflow-y-auto pr-1">{pkg.description || 'Customizable tour package. Send us an enquiry to learn more!'}</p>
                                                
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 sm:p-4 md:p-5 relative">
                                            <div className="relative z-10">
                                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-india-blue-800 mb-1 group-hover:text-india-blue-900 transition-colors line-clamp-2">
                                                    {pkg.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1 group-hover:text-gray-700 transition-colors line-clamp-1">{pkg.location}</p>

                                                <div className="flex items-center justify-between mt-4 sm:mt-5 md:mt-6">
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500">Starting from</p>
                                                        <p className="text-xl sm:text-2xl font-bold text-india-saffron-600 group-hover:text-india-saffron-700 transition-colors">
                                                            {pkg.price}
                                                        </p>
                                                    </div>
                                                    <Link to={`/booking?package=${encodeURIComponent(pkg.title || '')}&price=${String(pkg.price || '').replace(/[^0-9.]/g, '')}&emoji=${encodeURIComponent(pkg.emoji || '')}&location=${encodeURIComponent(pkg.location || '')}`}>
                                                        <motion.button
                                                            whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(0, 86, 214, 0.3)" }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-india-blue-600 text-white font-semibold text-sm sm:text-base rounded-full hover:bg-india-blue-700 transition-all duration-300 shadow-md"
                                                        >
                                                            Book Now
                                                        </motion.button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* No Packages Message */}
                        {!pkgLoading && filteredPackages.length === 0 && (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-bold text-gray-400 mb-4">No packages available</h3>
                                <p className="text-gray-500">Check back soon for new destinations!</p>
                            </div>
                        )}
                    </>
                )}

                {/* Hardcoded Maharashtra Routes */}
                {showHardcoded && type === 'maharashtra' && (
                    <>
                        {/* Packages Grid */}
                        <div className={preview ? "flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 pt-4 -mt-4 px-4 -mx-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"}>
                            {maharashtraRoutes.map((pkg) => (
                                <motion.div
                                    key={pkg.id}
                                    whileHover={{ y: -10 }}
                                    className={`package-card bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group relative ${preview ? 'w-[85vw] sm:w-[350px] lg:w-[400px] flex-shrink-0 snap-center' : ''}`}
                                >
                                    {/* Image */}
                                    <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
                                        <motion.img
                                            src={pkg.image}
                                            alt={pkg.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-all duration-700"
                                            whileHover={{ scale: 1.15, filter: "brightness(1.1)" }}
                                            onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-india-saffron-500/40 via-transparent to-india-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        />


                                        <div className="absolute bottom-4 left-4">
                                            <span className="text-white/90 text-sm font-medium bg-india-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                                {pkg.duration}
                                            </span>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-3 bg-white text-india-blue-800 font-bold rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                            >
                                                Quick View
                                            </motion.button>
                                        </motion.div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 sm:p-5 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-india-blue-50/0 to-india-saffron-50/0 group-hover:from-india-blue-50/50 group-hover:to-india-saffron-50/50 transition-all duration-500 rounded-b-2xl" />

                                        <div className="relative z-10">
                                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-india-blue-800 mb-1 group-hover:text-india-blue-900 transition-colors leading-tight">
                                                {pkg.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 mb-1.5 group-hover:text-gray-700 transition-colors">{pkg.location}</p>

                                            <div className="flex items-center justify-between mt-6">
                                                <div>
                                                    <p className="text-sm text-gray-500">Starting from</p>
                                                    <p className="text-2xl font-bold text-india-saffron-600 group-hover:text-india-saffron-700 transition-colors">
                                                        {pkg.price}
                                                    </p>
                                                </div>
                                                <Link to="/packages">
                                                    <motion.button
                                                        whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(0, 86, 214, 0.3)" }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-6 py-2 bg-india-blue-600 text-white font-semibold rounded-full hover:bg-india-blue-700 transition-all duration-300 shadow-md"
                                                    >
                                                        View Details
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-india-saffron-300/50 transition-all duration-500 pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* Hardcoded India Tour Packages */}
                {showHardcoded && type === 'india' && (
                    <>
                        {/* Packages Grid */}
                        <div className={preview ? "flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 pt-4 -mt-4 px-4 -mx-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"}>
                            {indiaPackages.map((pkg) => (
                                <motion.div
                                    key={pkg.id}
                                    whileHover={{ y: -10 }}
                                    className={`package-card bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group relative ${preview ? 'w-[85vw] sm:w-[350px] lg:w-[400px] flex-shrink-0 snap-center' : ''}`}
                                >
                                    {/* Image */}
                                    <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
                                        <motion.img
                                            src={pkg.image}
                                            alt={pkg.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-all duration-700"
                                            whileHover={{ scale: 1.15, filter: "brightness(1.1)" }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-india-saffron-500/40 via-transparent to-india-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        />


                                        <div className="absolute bottom-4 left-4">
                                            <span className="text-white/90 text-sm font-medium bg-india-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                                {pkg.duration}
                                            </span>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-3 bg-white text-india-blue-800 font-bold rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                            >
                                                Quick View
                                            </motion.button>
                                        </motion.div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 sm:p-5 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-india-blue-50/0 to-india-saffron-50/0 group-hover:from-india-blue-50/50 group-hover:to-india-saffron-50/50 transition-all duration-500 rounded-b-2xl" />

                                        <div className="relative z-10">
                                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-india-blue-800 mb-1 group-hover:text-india-blue-900 transition-colors leading-tight">
                                                {pkg.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 mb-1.5 group-hover:text-gray-700 transition-colors">{pkg.location}</p>

                                            <div className="flex items-center justify-between mt-6">
                                                <div>
                                                    <p className="text-sm text-gray-500">Starting from</p>
                                                    <p className="text-2xl font-bold text-india-saffron-600 group-hover:text-india-saffron-700 transition-colors">
                                                        {pkg.price}
                                                    </p>
                                                </div>
                                                <Link to="/packages">
                                                    <motion.button
                                                        whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(0, 86, 214, 0.3)" }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-6 py-2 bg-india-blue-600 text-white font-semibold rounded-full hover:bg-india-blue-700 transition-all duration-300 shadow-md"
                                                    >
                                                        View Details
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-india-saffron-300/50 transition-all duration-500 pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
});

export default TourPackages;
