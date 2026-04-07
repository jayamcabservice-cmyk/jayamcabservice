import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

const FeaturedDestinations = () => {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);

    const destinations = [
        {
            id: 1,
            name: 'Gateway of India, Mumbai',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop',
            description: 'Iconic monument of Mumbai',
            tag: 'Heritage',
        },
        {
            id: 2,
            name: 'Marine Drive, Mumbai',
            image: 'https://images.unsplash.com/photo-1570168907722-6d34a374f028?q=80&w=1200&auto=format&fit=crop',
            description: 'Queen\'s Necklace - Art Deco promenade',
            tag: 'City',
        },
        {
            id: 3,
            name: 'Nashik Vineyards',
            image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1200&auto=format&fit=crop',
            description: 'Wine capital of India',
            tag: 'Adventure',
        },
        {
            id: 4,
            name: 'Lonavala Hills',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop',
            description: 'Scenic hill station getaway',
            tag: 'Mountain',
        },
        {
            id: 5,
            name: 'Ajanta & Ellora Caves',
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop',
            description: 'Ancient rock-cut caves',
            tag: 'Heritage',
        },
        {
            id: 6,
            name: 'Alibaug Beaches',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
            description: 'Pristine coastal paradise',
            tag: 'Beach',
        },
        {
            id: 7,
            name: 'Mahabaleshwar',
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1200&auto=format&fit=crop',
            description: 'Strawberry hills paradise',
            tag: 'Mountain',
        },
        {
            id: 8,
            name: 'Kolad River Rafting',
            image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?q=80&w=1200&auto=format&fit=crop',
            description: 'Adventure sports hub',
            tag: 'Adventure',
        },
    ];

    const duplicatedDestinations = [...destinations, ...destinations, ...destinations];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId;
        let scrollPosition = 0;
        const scrollSpeed = 0.8;

        const scroll = () => {
            if (!isPaused) {
                scrollPosition += scrollSpeed;
                const maxScroll = scrollContainer.scrollWidth / 3;
                if (scrollPosition >= maxScroll) {
                    scrollPosition = 0;
                }
                scrollContainer.scrollLeft = scrollPosition;
            }
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [isPaused]);

    const headerRef = useIntersectionReveal('fadeUp', { duration: 0.6 });
    const carouselRef = useIntersectionReveal('fadeUp', { duration: 0.8 });

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={headerRef}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-4">
                        Popular Destinations of Maharashtra
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore the most beautiful tourist spots across Maharashtra
                    </p>
                </div>

                <div
                    ref={carouselRef}
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Gradient fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-hidden py-4"
                        style={{ scrollBehavior: 'auto' }}
                    >
                        {duplicatedDestinations.map((destination, index) => (
                            <motion.div
                                key={`${destination.id}-${index}`}
                                whileHover={{ y: -10, scale: 1.03 }}
                                className="flex-shrink-0 w-80 md:w-96 h-96 relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer"
                            >
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                {/* Tag badge */}
                                <div className="absolute top-4 right-4 bg-india-saffron-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    {destination.tag}
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaMapMarkerAlt className="text-india-saffron-400 text-xl" />
                                        <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                                    </div>
                                    <p className="text-gray-200 text-lg">{destination.description}</p>

                                    {/* Explore button - appears on hover */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        whileHover={{ opacity: 1, y: 0 }}
                                        className="mt-4 px-6 py-2 bg-white text-india-blue-800 font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                                    >
                                        Explore Now
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDestinations;
