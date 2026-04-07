import { useEffect, useRef } from 'react';
import { animationState } from '../utils/animationState';

/**
 * Intersection Observer-based reveal animations hook.
 * Provides scroll-triggered animations using native Intersection Observer API.
 *
 * @param {string} preset - Animation preset name (fadeUp, fadeDown, fadeLeft, fadeRight, scaleIn)
 * @param {object} options - Configuration options
 * @returns {React.RefObject} - Ref to attach to the animated element
 */
export const useIntersectionReveal = (preset = 'fadeUp', options = {}) => {
    const ref = useRef(null);
    const isHardRefresh = typeof window !== 'undefined' && performance.getEntriesByType('navigation')[0]?.type === 'reload';
    const animationKey = `animated_${preset}_${options.start || 'top 85%'}`;
    const hasAnimatedBefore = !isHardRefresh && typeof sessionStorage !== 'undefined' && sessionStorage.getItem(animationKey) === 'true';
    const {
        delay = 0,
        duration = 1,
        stagger = 0.15,
        start = 'top 85%',
        once = true,
        children = false,
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Skip initial animation if already played in this session
        if (once && hasAnimatedBefore) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: start.replace('top ', '-').replace('%', 'px') || '-100px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targets = children ? Array.from(el.children) : [el];
                    
                    targets.forEach((target, index) => {
                        const targetDelay = children ? index * stagger : 0;
                        
                        setTimeout(() => {
                            switch (preset) {
                                case 'fadeUp':
                                    target.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
                                    target.style.opacity = '1';
                                    target.style.transform = 'translateY(0)';
                                    break;

                                case 'fadeDown':
                                    target.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
                                    target.style.opacity = '1';
                                    target.style.transform = 'translateY(0)';
                                    break;

                                case 'fadeLeft':
                                    target.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
                                    target.style.opacity = '1';
                                    target.style.transform = 'translateX(0)';
                                    break;

                                case 'fadeRight':
                                    target.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
                                    target.style.opacity = '1';
                                    target.style.transform = 'translateX(0)';
                                    break;

                                case 'scaleIn':
                                    target.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
                                    target.style.opacity = '1';
                                    target.style.transform = 'scale(1)';
                                    break;

                                default:
                                    target.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
                                    target.style.opacity = '1';
                                    target.style.transform = 'translateY(0)';
                            }
                        }, (delay + targetDelay) * 1000);
                    });

                    if (once) {
                        animationState.markAsPlayed(animationKey);
                        observer.unobserve(el);
                    }
                } else if (!once) {
                    // Reset styles when not in view
                    const targets = children ? Array.from(el.children) : [el];
                    targets.forEach((target) => {
                        target.style.opacity = '0';
                        switch (preset) {
                            case 'fadeUp':
                            case 'fadeDown':
                                target.style.transform = 'translateY(60px)';
                                break;
                            case 'fadeLeft':
                                target.style.transform = 'translateX(-80px)';
                                break;
                            case 'fadeRight':
                                target.style.transform = 'translateX(80px)';
                                break;
                            case 'scaleIn':
                                target.style.transform = 'scale(0.8)';
                                break;
                        }
                    });
                }
            });
        }, observerOptions);

        // Set initial styles
        const targets = children ? Array.from(el.children) : [el];
        targets.forEach((target) => {
            target.style.opacity = '0';
            switch (preset) {
                case 'fadeUp':
                case 'fadeDown':
                    target.style.transform = 'translateY(60px)';
                    break;
                case 'fadeLeft':
                    target.style.transform = 'translateX(-80px)';
                    break;
                case 'fadeRight':
                    target.style.transform = 'translateX(80px)';
                    break;
                case 'scaleIn':
                    target.style.transform = 'scale(0.8)';
                    break;
                default:
                    target.style.transform = 'translateY(60px)';
            }
        });

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [once, animationKey, hasAnimatedBefore, preset, duration, delay, stagger, children, start]);

    return ref;
};

export default useIntersectionReveal;
