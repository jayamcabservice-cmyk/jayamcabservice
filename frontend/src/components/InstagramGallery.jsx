import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const InstagramGallery = () => {
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const ctaRef = useIntersectionReveal('scaleIn', { delay: 0.3 });
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % photos.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);

    const photos = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600&auto=format&fit=crop',
            likes: '2.4k',
            location: 'Udaipur',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
            likes: '3.1k',
            location: 'Leh-Ladakh',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop',
            likes: '5.2k',
            location: 'Taj Mahal',
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=600&auto=format&fit=crop',
            likes: '4.8k',
            location: 'Kashmir',
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
            likes: '3.6k',
            location: 'Goa',
        },
        {
            id: 6,
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
            likes: '4.2k',
            location: 'Kerala',
        },
        {
            id: 7,
            image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop',
            likes: '3.9k',
            location: 'Jaipur',
        },
        {
            id: 8,
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop',
            likes: '2.8k',
            location: 'Manali',
        },
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headingRef} className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-4">
                        Experience The Magic
                    </h2>
                    <p className="text-xl text-gray-600">Explore breathtaking destinations from our travel gallery</p>
                </div>

                {/* Deck of Cards Coverflow */}
                <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center overflow-hidden py-4 perspective-1000">
                    <AnimatePresence initial={false}>
                        {photos.map((photo, index) => {
                            let offset = index - activeIndex;
                            if (offset > photos.length / 2) offset -= photos.length;
                            if (offset < -photos.length / 2) offset += photos.length;

                            const isCenter = offset === 0;
                            const absOffset = Math.abs(offset);

                            const xPos = `${offset * 55}%`;
                            const scale = isCenter ? 1 : Math.max(0.6, 1 - absOffset * 0.15);
                            const zIndex = 20 - absOffset;
                            const blur = isCenter ? 0 : absOffset * 3;
                            const opacity = absOffset > 2 ? 0 : (isCenter ? 1 : 0.6);
                            // pseudo random rotation based on id so it remains consistent and acts like physically scattered cards
                            const rotateDeg = isCenter ? 0 : ((photo.id * 7) % 24) - 12;

                            return (
                                <motion.div
                                    key={photo.id}
                                    className="absolute w-[65vw] sm:w-[45vw] md:w-[350px] lg:w-[400px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                                    animate={{
                                        x: xPos,
                                        scale: scale,
                                        rotateZ: rotateDeg,
                                        zIndex: zIndex,
                                        filter: `blur(${blur}px)`,
                                        opacity: opacity,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.32, 0.72, 0, 1]
                                    }}
                                    onClick={() => {
                                        if (!isCenter) setActiveIndex(index);
                                    }}
                                >
                                    <img
                                        src={photo.image}
                                        alt={photo.location}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-6 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="flex items-center justify-between text-white">
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-india-saffron-400 text-lg sm:text-xl md:text-2xl" />
                                                <span className="font-bold text-lg sm:text-xl md:text-2xl drop-shadow-md">{photo.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaHeart className="text-red-400 text-lg sm:text-xl" />
                                                <span className="font-bold text-base sm:text-lg drop-shadow-md">{photo.likes}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Border glow effect on center element */}
                                    {isCenter && (
                                        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl sm:rounded-3xl shadow-inner pointer-events-none"></div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 lg:left-12 z-[60] bg-white/70 hover:bg-white text-india-blue-800 p-3 sm:p-4 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110"
                    >
                        <FaChevronLeft className="text-lg sm:text-xl md:text-2xl" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 lg:right-12 z-[60] bg-white/70 hover:bg-white text-india-blue-800 p-3 sm:p-4 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110"
                    >
                        <FaChevronRight className="text-lg sm:text-xl md:text-2xl" />
                    </button>
                </div>


            </div>
        </section>
    );
};

export default InstagramGallery;
