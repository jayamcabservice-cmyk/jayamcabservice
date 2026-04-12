import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const isHardRefresh = typeof window !== 'undefined' && performance.getEntriesByType('navigation')[0]?.type === 'reload';
    const hasPlayedIntro = !isHardRefresh && typeof sessionStorage !== 'undefined' && sessionStorage.getItem('jayam_travel_hero_intro') === 'true';

    const [displayText, setDisplayText] = useState('');
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(hasPlayedIntro);
    const [isVisible, setIsVisible] = useState(hasPlayedIntro);
    const [showCards, setShowCards] = useState(true);

    const phrases = ['Incredible India', 'Paradise on Earth', 'Your Dream Destination', 'Adventure Awaits'];

    const heroCards = [
        {
            image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&auto=format&fit=crop',
            title: 'Taj Mahal',
            tag: 'Heritage',
            color: '#F59E0B',
        },
        {
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=400&auto=format&fit=crop',
            title: 'Kashmir',
            tag: 'Mountain',
            color: '#3B82F6',
        },
        {
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400&auto=format&fit=crop',
            title: 'Goa',
            tag: 'Beach',
            color: '#10B981',
        },
        {
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=400&auto=format&fit=crop',
            title: 'Kerala',
            tag: 'Nature',
            color: '#8B5CF6',
        },
        {
            image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=400&auto=format&fit=crop',
            title: 'Jaipur',
            tag: 'Royal',
            color: '#EC4899',
        },
        {
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=400&auto=format&fit=crop',
            title: 'Manali',
            tag: 'Adventure',
            color: '#06B6D4',
        },
    ];

    // Typewriter effect
    useEffect(() => {
        if (!animationComplete) return;

        const currentPhrase = phrases[currentPhraseIndex];
        const typingSpeed = isDeleting ? 50 : 100;
        const pauseTime = isDeleting ? 500 : 2000;

        const timeout = setTimeout(() => {
            if (!isDeleting && displayText === currentPhrase) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            } else {
                setDisplayText(
                    isDeleting
                        ? currentPhrase.substring(0, displayText.length - 1)
                        : currentPhrase.substring(0, displayText.length + 1)
                );
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentPhraseIndex, animationComplete]);

    // Simple entrance animation
    useEffect(() => {
        if (hasPlayedIntro) {
            setIsVisible(true);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
            setAnimationComplete(true);
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem('jayam_travel_hero_intro', 'true');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [hasPlayedIntro]);

    // Hide cards after 4-5 seconds
    useEffect(() => {
        if (animationComplete && showCards) {
            const timer = setTimeout(() => {
                setShowCards(false);
            }, 4500); // 4.5 seconds

            return () => clearTimeout(timer);
        }
    }, [animationComplete, showCards]);

    const splitText = (text) => {
        return text.split('').map((char, i) => (
            <span
                key={i}
                className="inline-block"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: (i) => ({
            opacity: 0.9,
            scale: 1,
            y: Math.abs(i - 2.5) * -6,
            rotateZ: (i - 2.5) * 10,
            transition: { delay: i * 0.1, duration: 0.6, ease: 'backOut' }
        }),
        exploded: (i) => {
            const positions = [
                { x: -400, y: -200, rotateZ: -25, scale: 0.6 },
                { x: 400, y: -220, rotateZ: 18, scale: 0.55 },
                { x: -450, y: 150, rotateZ: 12, scale: 0.5 },
                { x: 450, y: 180, rotateZ: -15, scale: 0.55 },
                { x: -250, y: -280, rotateZ: 8, scale: 0.45 },
                { x: 300, y: 240, rotateZ: -10, scale: 0.5 },
            ];
            return {
                x: positions[i].x,
                y: positions[i].y,
                rotateZ: positions[i].rotateZ,
                scale: positions[i].scale,
                opacity: 0.85,
                transition: { duration: 1, ease: 'easeInOut' }
            };
        },
        vanish: {
            opacity: 0,
            scale: 0.5,
            y: 100,
            transition: { duration: 0.8, ease: 'easeInOut' }
        }
    };

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden z-0 bg-[#0a0f1c]">
            {/* Background Image */}
            <motion.div
                /* initial={{ scale: 1.3, opacity: 0 }} */
                /* animate={isVisible ? { scale: 1.1, opacity: 1 } : {}} */
                /* transition={{ duration: 1.5, ease: 'easeOut' }} */
                className="absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop')`,
                }}
            />

            {/* Overlay */}
            <motion.div
                /* initial={{ opacity: 0 }} */
                /* animate={isVisible ? { opacity: 1 } : {}} */
                /* transition={{ duration: 1, delay: 0.3 }} */
                className="absolute inset-0 z-[2] bg-gradient-to-r from-india-blue-900/80 via-india-blue-800/70 to-india-saffron-900/40"
            />

            {/* Cards Container */}
            <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none perspective-1200">
                {showCards && heroCards.map((card, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        /* initial="hidden" */
                        /* animate={animationComplete ? (showCards ? "exploded" : "vanish") : "visible"} */
                        /* variants={cardVariants} */
                        className="absolute"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className="relative w-32 h-44 sm:w-40 sm:h-52 md:w-44 md:h-60 lg:w-52 lg:h-68 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                            <div
                                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl z-0"
                                style={{ backgroundColor: card.color }}
                            />
                            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-white/20">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                    <span
                                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white"
                                        style={{ backgroundColor: `${card.color}cc` }}
                                    >
                                        {card.tag}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                    <h3 className="text-white font-bold text-sm sm:text-lg drop-shadow-lg">{card.title}</h3>
                                    <div
                                        className="w-4 h-0.5 sm:w-8 sm:h-0.5 rounded-full mt-1"
                                        style={{ backgroundColor: card.color }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <motion.div
                /* initial={{ opacity: 0, y: 30 }} */
                /* animate={isVisible ? { opacity: 1, y: 0 } : {}} */
                /* transition={{ duration: 0.8, delay: 0.5 }} */
                className="relative z-[5] max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center"
            >
                <h1 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-4">
                    <span className="inline-flex">
                        {splitText('Discover the')}
                    </span>
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-india-saffron-300 via-india-saffron-400 to-india-saffron-500 whitespace-nowrap">
                        {displayText}
                        <span className="animate-pulse">|</span>
                    </span>
                </h1>

                <motion.p
                    /* initial={{ opacity: 0 }} */
                    /* animate={isVisible ? { opacity: 1 } : {}} */
                    /* transition={{ duration: 0.6, delay: 0.7 }} */
                    className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-10 md:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
                >
                    Curated tour packages across India's most breathtaking destinations.
                    <br />
                    <span className="text-india-saffron-300 font-medium">Your adventure starts here!</span>
                </motion.p>

                <motion.div
                    /* initial={{ opacity: 0, y: 20 }} */
                    /* animate={isVisible ? { opacity: 1, y: 0 } : {}} */
                    /* transition={{ duration: 0.6, delay: 0.9 }} */
                    className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center w-full xs:w-auto"
                >
                    <motion.a
                        href="#packages"
                        whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(255, 143, 0, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 xs:px-8 sm:px-10 py-3 xs:py-4 bg-gradient-to-r from-india-saffron-500 to-india-saffron-600 text-white font-bold text-sm sm:text-base rounded-full shadow-2xl hover:shadow-india-saffron-500/50 transition-all duration-300 min-w-[160px] sm:min-w-[200px]"
                    >
                        Explore Packages
                    </motion.a>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                /* initial={{ opacity: 0, y: 20 }} */
                /* animate={isVisible ? { opacity: 1, y: 0 } : {}} */
                /* transition={{ duration: 0.5, delay: 1 }} */
                className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-[6]"
            >
                <div className="w-6 h-10 sm:w-7 sm:h-12 border-2 border-white/60 rounded-full flex justify-center p-1.5 sm:p-2">
                    <motion.div
                        className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white rounded-full"
                        animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
                <p className="text-white/70 text-xs sm:text-sm mt-2 sm:mt-3 font-medium tracking-wider">SCROLL</p>
            </motion.div>
        </section>
    );
};

export default Hero;
