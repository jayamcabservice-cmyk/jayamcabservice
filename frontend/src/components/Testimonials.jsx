import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const Testimonials = ({ preview = false }) => {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const statsRef = useIntersectionReveal('staggerUp', { stagger: 0.1, start: 'top 80%' });
    const carouselRef = useRef(null);

    const testimonials = [
        {
            id: 1,
            name: 'आरती पाटील (Aarti Patil)',
            location: 'Pune, Maharashtra',
            text: 'खूप छान experience! The tour was व्यवस्थित organized. Guide bahut helpful होते. Truly unforgettable memories बनवले!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=47',
        },
        {
            id: 2,
            name: 'राजेश कुमार (Rajesh Kumar)',
            location: 'Mumbai, Maharashtra',
            text: 'Golden Triangle trip was fantastic! हर जगह का planning एकदम perfect था. Highly recommend करता हूं!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=12',
        },
        {
            id: 3,
            name: 'प्रिया शर्मा (Priya Sharma)',
            location: 'Nagpur, Maharashtra',
            text: 'Kerala backwaters tour was अप्रतिम! Such peaceful and beautiful experience. Team was very professional.',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=45',
        },
        {
            id: 4,
            name: 'विकास देशमुख (Vikas Deshmukh)',
            location: 'Nashik, Maharashtra',
            text: 'Kashmir trip was मस्त! Snow, mountains, everything was perfect. Family सबकुछ enjoy किया!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=33',
        },
        {
            id: 5,
            name: 'स्नेहा जोशी (Sneha Joshi)',
            location: 'Kolhapur, Maharashtra',
            text: 'Rajasthan tour was royal experience! गाईड खूप माहितीपूर्ण होते. Photos आणि memories forever!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=44',
        },
        {
            id: 6,
            name: 'अमित वर्मा (Amit Verma)',
            location: 'Aurangabad, Maharashtra',
            text: 'Goa trip with family was धमाल! Beach, food, सगळं perfect. Value for money एकदम!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=13',
        },
        {
            id: 7,
            name: 'माधुरी कुलकर्णी (Madhuri Kulkarni)',
            location: 'Solapur, Maharashtra',
            text: 'Himachal tour was breathtaking! Hills, valleys - nature at its best. Guide was बहुत अच्छे!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=48',
        },
        {
            id: 8,
            name: 'संदीप पवार (Sandeep Pawar)',
            location: 'Thane, Maharashtra',
            text: 'Corporate trip to Jaipur was excellently managed! Time management perfect होते. Will book again!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=14',
        },
        {
            id: 9,
            name: 'वैशाली राजे (Vaishali Raje)',
            location: 'Satara, Maharashtra',
            text: 'North East tour was mind-blowing experience! Scenic beauty आणि culture - everything was amazing!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=43',
        },
        {
            id: 10,
            name: 'रोहित भोसले (Rohit Bhosle)',
            location: 'Ahmednagar, Maharashtra',
            text: 'South India temple tour was divine! हर मंदिर का experience अद्भुत था. Peaceful आणि spiritual!',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=15',
        },
    ];

    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    const handleTouchStart = () => {
        setIsPaused(true);
    };

    const handleTouchEnd = () => {
        setIsPaused(false);
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;

        let animationId;
        const scrollSpeed = 0.5;

        const scroll = () => {
            if (!isPaused && scrollContainer) {
                scrollContainer.scrollLeft -= scrollSpeed;
                const maxScroll = scrollContainer.scrollWidth / 3;
                if (scrollContainer.scrollLeft <= 0) {
                    scrollContainer.scrollLeft = maxScroll;
                }
            }
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [isPaused]);

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div ref={headingRef} className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-india-blue-800 mb-3">
                        What Our Travelers Say
                    </h2>
                    <p className="text-sm sm:text-base lg:text-xl text-gray-600">
                        Real experiences from people who traveled with us
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div
                    ref={carouselRef}
                    className="relative cursor-pointer select-none"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    {/* Scrolling Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-hidden py-8"
                        style={{ scrollBehavior: 'auto' }}
                    >
                        {duplicatedTestimonials.map((testimonial, index) => (
                            <motion.div
                                key={`${testimonial.id}-${index}`}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl shadow-lg p-4 sm:p-6 relative overflow-hidden group"
                            >
                                {/* Quote Icon Background */}
                                <div className="absolute top-4 right-4 opacity-10">
                                    <FaQuoteLeft size={80} className="text-india-saffron-500" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FaStar key={i} className="text-india-saffron-500" size={20} />
                                        ))}
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-gray-700 text-base mb-6 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Reviewer Info */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            loading="lazy"
                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-india-blue-200"
                                        />
                                        <div>
                                            <h4 className="font-bold text-india-blue-800">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Border Effect */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-india-saffron-400/40 rounded-2xl transition-all duration-300 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stats Section — 2-col on mobile, 4 on desktop */}
                <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-10 sm:mt-12 lg:mt-16">
                    <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-india-blue-700 mb-1 sm:mb-2">10,000+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Happy Travelers</div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-india-saffron-600 mb-1 sm:mb-2">4.9/5</div>
                        <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-india-blue-700 mb-1 sm:mb-2">500+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Tours Completed</div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-india-saffron-600 mb-1 sm:mb-2">15+</div>
                        <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
