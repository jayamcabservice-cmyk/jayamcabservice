import React, { useRef, useEffect, memo } from 'react';
import Hero from '../components/Hero';
import ModernSlider from '../components/ModernSlider';
import TourPackages from '../components/TourPackages';
import WhyChooseUs from '../components/WhyChooseUs';
import InstagramGallery from '../components/InstagramGallery';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const Home = memo(() => {
    const viewAllRef = useIntersectionReveal('scaleIn', { delay: 0.2 });

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

            {/* Hardcoded Popular Maharashtra Routes Section */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TourPackages showHardcoded={true} type="maharashtra" preview={false} />
                </div>
            </section>

            {/* Hardcoded India Tour Packages Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TourPackages showHardcoded={true} type="india" preview={false} />

                    <div ref={viewAllRef} className="text-center mt-8">
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
                </div>
            </section>

            <WhyChooseUs />
            <InstagramGallery />

            {/* Testimonials Preview */}
            <Testimonials preview={true} />
        </>
    );
});

export default Home;
