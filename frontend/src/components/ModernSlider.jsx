import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const ModernSlider = React.memo(() => {
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const sectionRef = useRef(null);
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });

    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop',
            title: 'Gateway of India',
            subtitle: 'Mumbai, Maharashtra',
            description: 'Iconic monument of Mumbai',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=800&auto=format&fit=crop',
            title: 'Marine Drive',
            subtitle: 'Mumbai, Maharashtra',
            description: 'Queen\'s Necklace - Art Deco promenade',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800&auto=format&fit=crop',
            title: 'Nashik Vineyards',
            subtitle: 'Nashik, Maharashtra',
            description: 'Wine capital of India',
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
            title: 'Lonavala Hills',
            subtitle: 'Maharashtra',
            description: 'Scenic hill station getaway',
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop',
            title: 'Ajanta & Ellora Caves',
            subtitle: 'Aurangabad, Maharashtra',
            description: 'Ancient rock-cut caves',
        },
        {
            id: 6,
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
            title: 'Alibaug Beaches',
            subtitle: 'Maharashtra',
            description: 'Pristine coastal paradise',
        },
        {
            id: 7,
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop',
            title: 'Mahabaleshwar',
            subtitle: 'Maharashtra',
            description: 'Strawberry hills paradise',
        },
        {
            id: 8,
            image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?q=80&w=800&auto=format&fit=crop',
            title: 'Kolad River Rafting',
            subtitle: 'Maharashtra',
            description: 'Adventure sports hub',
        },
    ];

    const duplicatedSlides = [...slides, ...slides, ...slides];

    const handleTouchStart = () => {
        setIsPaused(true);
    };

    const handleTouchEnd = () => {
        setIsPaused(false);
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId;
        const scrollSpeed = 0.5;

        const scroll = () => {
            if (!isPaused && scrollContainer) {
                scrollContainer.scrollLeft += scrollSpeed;
                const maxScroll = scrollContainer.scrollWidth / 3;
                if (scrollContainer.scrollLeft >= maxScroll) {
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [isPaused]);

    return (
        <section ref={sectionRef} className="py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div ref={headingRef} className="text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-4">
                        Popular Destinations of Maharashtra
                    </h2>
                    <p className="text-xl text-gray-600">
                        Explore the most beautiful tourist spots across Maharashtra
                    </p>
                </div>
            </div>

            <div
                ref={sectionRef}
                className="relative cursor-pointer select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Gradient fades */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-hidden py-4"
                    style={{ scrollBehavior: 'auto' }}
                >
                    {duplicatedSlides.map((slide, index) => (
                        <motion.div
                            key={`${slide.id}-${index}`}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="flex-shrink-0 w-64 h-80 relative rounded-2xl overflow-hidden shadow-lg group"
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300">
                                <p className="text-india-saffron-400 text-sm font-semibold mb-1">{slide.subtitle}</p>
                                <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {slide.description}
                                </p>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    className="mt-3 px-5 py-2 bg-white text-india-blue-800 font-bold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm shadow-lg"
                                >
                                    Explore →
                                </motion.button>
                            </div>

                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-india-saffron-400/60 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

export default ModernSlider;
