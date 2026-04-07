/**
 * Session Storage Helper for Animation State Management
 * Persists animation states across React Router navigations
 */

const STORAGE_KEY_PREFIX = 'jayam_travel_';

export const animationState = {
  /**
   * Check if an animation has been played
   * @param {string} key - Unique identifier for the animation
   * @returns {boolean} - True if animation has played
   */
  hasPlayed: (key) => {
    return sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`) === 'true';
  },

  /**
   * Mark an animation as played
   * @param {string} key - Unique identifier for the animation
   */
  markAsPlayed: (key) => {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, 'true');
  },

  /**
   * Clear a specific animation state
   * @param {string} key - Unique identifier for the animation
   */
  clear: (key) => {
    sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  },

  /**
   * Clear all animation states
   */
  clearAll: () => {
    const keys = Object.keys(sessionStorage).filter(key => 
      key.startsWith(STORAGE_KEY_PREFIX)
    );
    keys.forEach(key => sessionStorage.removeItem(key));
  },

  /**
   * Get all animation states
   * @returns {Array<string>} - List of animation keys that have been played
   */
  getAll: () => {
    return Object.keys(sessionStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .map(key => key.replace(STORAGE_KEY_PREFIX, ''));
  }
};

// Export individual helpers for convenience
export const hasAnimationPlayed = animationState.hasPlayed;
export const markAnimationAsPlayed = animationState.markAsPlayed;
export const clearAnimationState = animationState.clear;
export const clearAllAnimationStates = animationState.clearAll;
