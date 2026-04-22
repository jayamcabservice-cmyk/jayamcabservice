import React, { useRef, useEffect, memo, useState } from 'react';
import Hero from '../components/Hero';
import ModernSlider from '../components/ModernSlider';
import TourPackages from '../components/TourPackages';
import WhyChooseUs from '../components/WhyChooseUs';
import InstagramGallery from '../components/InstagramGallery';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const Home = memo(() => {
    const viewAllRef = useIntersectionReveal('scaleIn', { delay: 0.2 });
    const [activePackageTab, setActivePackageTab] = useState('maharashtra');

    return (
        <>
            <SEO
                title="Best Cab Service in Nashik | Car Rental & Taxi Booking — JAYAM Travels"
                description="Book affordable cab service in Nashik. Car rental, taxi to Pune, Shirdi, Mumbai & outstation trips across Maharashtra. 24/7 support. Call +91 70305 71513"
                keywords={[
                    'cab service nashik', 'car rental nashik', 'taxi service nashik',
                    'nashik cab booking', 'best cab in nashik', 'nashik to pune cab',
                    'nashik to mumbai taxi', 'nashik to shirdi cab', 'outstation cab nashik',
                    'nashik taxi fare per km', 'cheap cab service nashik',
                ]}
                url="/"
            />
            <Hero />
            <ModernSlider />

            {/* Tour Packages Tabbed Section */}
            <div className="pt-10 pb-2 bg-white flex justify-center w-full relative z-10">
                <div className="bg-gray-100 p-1.5 rounded-full flex gap-1 shadow-inner border border-gray-200">
                    <button
                        onClick={() => setActivePackageTab('maharashtra')}
                        className={`px-6 sm:px-10 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${activePackageTab === 'maharashtra' ? 'bg-india-blue-600 text-white shadow-lg scale-105' : 'text-gray-600 hover:text-india-blue-800 hover:bg-gray-200'}`}
                    >
                        Maharashtra Packages
                    </button>
                    <button
                        onClick={() => setActivePackageTab('india')}
                        className={`px-6 sm:px-10 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${activePackageTab === 'india' ? 'bg-india-blue-600 text-white shadow-lg scale-105' : 'text-gray-600 hover:text-india-blue-800 hover:bg-gray-200'}`}
                    >
                        All India Packages
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activePackageTab}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                >
                    <TourPackages 
                        showHardcoded={true} 
                        type={activePackageTab} 
                        preview={true} 
                    />
                </motion.div>
            </AnimatePresence>

            <div ref={viewAllRef} className="text-center pb-12 bg-gray-50 relative z-10 w-full">
                <Link to="/packages">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(0, 86, 214, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 bg-gradient-to-r from-india-blue-600 to-india-blue-700 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        View All Packages
                    </motion.button>
                </Link>
            </div>

            <WhyChooseUs />
            <InstagramGallery />

            {/* Testimonials Preview */}
            <Testimonials preview={true} />
        </>
    );
});

export default Home;
