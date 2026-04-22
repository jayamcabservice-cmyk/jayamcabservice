import React, { useEffect, useRef } from 'react';
import WhyChooseUs from '../components/WhyChooseUs';
import Statistics from '../components/Statistics';
import SEO from '../components/SEO';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const AboutPage = React.memo(() => {
    const headerRef = useIntersectionReveal('fadeUp', { duration: 0.8, start: 'top 90%' });
    const storyRef = useRef(null);
    const missionRef = useRef(null);

    // Removed GSAP animations - using CSS transitions instead

    return (
        <div className="bg-white">
            <SEO
                title="About JAYAM Travels | Trusted Cab Service in Nashik Since 2010"
                description="JAYAM Travels — Nashik's trusted cab service with 15+ years of experience. 10,000+ happy travelers. Professional drivers, 24/7 support & best prices."
                keywords={[
                    'about jayam travels', 'cab service nashik', 'trusted taxi nashik',
                    'nashik travel company', 'jayam cab service history',
                ]}
                url="/about"
            />
            {/* Page Header */}
            <section className="pt-32 pb-20 bg-gradient-to-br from-india-blue-800 via-india-blue-700 to-india-saffron-600 relative overflow-hidden z-0">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[5]">
                    <div ref={headerRef} className="text-center text-white">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                            About JAYAM Travels — Nashik's Trusted Cab Service
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                            Your trusted partner for comfortable & affordable travel across Maharashtra
                        </p>
                    </div>
                </div>
            </section>

            {/* About Content */}
            <section className="py-10 sm:py-14 lg:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <div ref={storyRef}>
                            <h2 className="text-2xl sm:text-3xl font-bold text-india-blue-800 mb-4 sm:mb-6">Our Story</h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                                JAYAM Cab Service, based in Nashik, Maharashtra, has been providing reliable and affordable car rental and taxi services for over 15 years.
                                We specialize in local cab service in Nashik, outstation trips to Pune, Mumbai, Shirdi, and tour packages across Maharashtra and India.
                            </p>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                                With a fleet of well-maintained vehicles — from hatchbacks to luxury coaches — and a team of professional, experienced drivers,
                                we've served 10,000+ happy travelers. Whether it's a Nashik darshan, a pilgrimage to Trimbakeshwar, a business trip to Pune,
                                or a family vacation to Goa — JAYAM Travels ensures a safe, comfortable, and transparent travel experience every time.
                            </p>
                        </div>
                        <div ref={missionRef}>
                            <h2 className="text-2xl sm:text-3xl font-bold text-india-blue-800 mb-4 sm:mb-6 mt-8 sm:mt-12">Our Mission</h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                                To be Nashik's most trusted cab service — delivering safe, affordable, and on-time car rental experiences
                                with professional drivers, transparent pricing, and 24/7 customer support across Maharashtra and India.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
});

export default AboutPage;
