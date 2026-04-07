import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

const InstagramGallery = () => {
    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const gridRef = useIntersectionReveal('staggerScale', { stagger: 0.08, start: 'top 80%' });
    const ctaRef = useIntersectionReveal('scaleIn', { delay: 0.3 });

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
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headingRef} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-4">
                        Travel Gallery
                    </h2>
                    <p className="text-xl text-gray-600">Follow our adventures @tstravels</p>
                </div>

                <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                        <motion.div
                            key={photo.id}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                        >
                            <img
                                src={photo.image}
                                alt={photo.location}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-india-saffron-400" />
                                            <span className="font-bold">{photo.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaHeart className="text-red-400" />
                                            <span className="font-bold">{photo.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Border glow effect on hover */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-india-saffron-400 rounded-2xl transition-all duration-300"></div>
                        </motion.div>
                    ))}
                </div>

                <div ref={ctaRef} className="text-center mt-12">
                    <motion.a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        Follow Us on Instagram
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default InstagramGallery;
