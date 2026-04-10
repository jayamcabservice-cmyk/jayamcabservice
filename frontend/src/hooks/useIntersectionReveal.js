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

    // Scroll triggered animations disabled per user request
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        
        // Just ensure opacity is 1 and no transform is applied, overriding any inline styles
        // But since we are not setting it to 0 anymore, we can just do nothing or set to 1.
        const targets = children ? Array.from(el.children) : [el];
        targets.forEach((target) => {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0) scale(1) translateX(0)';
            target.style.transition = 'none';
        });
    }, [children]);

    return ref;
};

export default useIntersectionReveal;
