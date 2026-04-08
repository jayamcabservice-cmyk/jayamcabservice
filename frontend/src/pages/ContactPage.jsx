import React, { useEffect, useRef } from 'react';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const ContactPage = React.memo(() => {
    const headerRef = useIntersectionReveal('fadeUp', { duration: 0.8, start: 'top 90%' });
    const cardsRef = useIntersectionReveal('staggerUp', { stagger: 0.1, start: 'top 80%' });
    const reachHeadingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const mapRef = useRef(null);
    const directionsRef = useRef(null);
    const sectionRef = useRef(null);

    // Removed GSAP animations - using CSS transitions instead

    return (
        <section ref={sectionRef} className="bg-gradient-to-b from-gray-50 to-white">
            {/* Page Header */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-india-blue-800 via-india-saffron-600 to-india-blue-700 relative overflow-hidden z-0">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[5]">
                    <div ref={headerRef} className="text-center text-white">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">
                            We're here to help plan your perfect journey
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-10 sm:py-12 lg:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {[
                            { icon: <FaPhone className="text-xl sm:text-3xl" />, title: 'Phone', info: '+91 98765 43210', subtitle: 'Mon-Sat 9am-8pm' },
                            { icon: <FaEnvelope className="text-xl sm:text-3xl" />, title: 'Email', info: 'info@tstravels.com', subtitle: 'Online support' },
                            { icon: <FaMapMarkerAlt className="text-xl sm:text-3xl" />, title: 'Address', info: 'Mumbai, Maharashtra', subtitle: 'Visit our office' },
                            { icon: <FaClock className="text-xl sm:text-3xl" />, title: 'Working Hours', info: '9:00 AM - 8:00 PM', subtitle: 'Mon to Saturday' },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className="text-india-blue-600 flex justify-center mb-2 sm:mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{item.title}</h3>
                                <p className="text-india-blue-700 font-semibold mb-0.5 text-xs sm:text-sm break-all">{item.info}</p>
                                <p className="text-gray-500 text-xs">{item.subtitle}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Map & Reach Out Section */}
            <section className="py-10 sm:py-12 lg:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={reachHeadingRef} className="text-center mb-8 sm:mb-10 lg:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-india-blue-800 mb-3">
                            How to Reach Us
                        </h2>
                        <p className="text-sm sm:text-base lg:text-xl text-gray-600">
                            Visit our office or connect with us online
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Map */}
                        <div
                            ref={mapRef}
                            className="rounded-2xl overflow-hidden shadow-2xl h-[280px] sm:h-[350px] lg:h-[450px]"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.082177513327956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1644329952789!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="JAYAM Travels Location"
                            />
                        </div>

                        {/* Reach Out Instructions */}
                        <div
                            ref={directionsRef}
                            className="flex flex-col justify-center space-y-6"
                        >
                            <div className="bg-gradient-to-br from-india-blue-50 to-india-saffron-50 p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold text-india-blue-800 mb-6">
                                    Getting Here
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-india-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                            1
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-1">By Air</h4>
                                            <p className="text-gray-600">
                                                Chhatrapati Shivaji Maharaj International Airport (35 km away).
                                                Take a taxi or metro to reach our office.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-india-saffron-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                            2
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-1">By Train</h4>
                                            <p className="text-gray-600">
                                                Mumbai Central Railway Station (5 km). Local trains available
                                                connecting all parts of Mumbai.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-india-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                            3
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-1">By Road</h4>
                                            <p className="text-gray-600">
                                                Well connected by state and private buses. Ample parking
                                                available at our office premises.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <motion.a
                                    href="https://maps.google.com/?q=Mumbai+Maharashtra"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-6 inline-block px-8 py-3 bg-gradient-to-r from-india-blue-600 to-india-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Get Directions →
                                </motion.a>
                            </div>

                            <div className="bg-gradient-to-br from-india-saffron-50 to-india-blue-50 p-6 rounded-2xl">
                                <p className="text-gray-700 text-center">
                                    <span className="font-bold text-india-blue-800">💼 Business Hours:</span>
                                    <br />
                                    Monday - Saturday: 9:00 AM - 8:00 PM
                                    <br />
                                    <span className="text-sm text-gray-600">Sunday: Closed (Online support available)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <ContactForm />
        </section>
    );
});

export default ContactPage;
