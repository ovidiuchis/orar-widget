/**
 * Utilities Module for Schedule Widget
 * Collection of helper functions for DOM manipulation, data handling, and common operations
 * @module Utils
 */

const Utils = {
  /**
   * Query selector helper (returns first match)
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element (defaults to document)
   * @returns {Element|null} - First matching element or null
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },
  
  /**
   * Query selector all helper (returns array)
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element (defaults to document)
   * @returns {Array} - Array of matching elements
   */
  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },
  
  /**
   * Sleep/delay helper
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} - Promise that resolves after delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * Wait for element to appear in DOM
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   * @returns {Promise<Element>} - Promise that resolves with element
   */
  waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = this.$(selector);
      if (element) return resolve(element);
      
      const observer = new MutationObserver(() => {
        const el = this.$(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },
  
  /**
   * Debounce function calls
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} - Debounced function
   */
  debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },
  
  /**
   * Throttle function execution
   * @param {Function} fn - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} - Throttled function
   */
  throttle(fn, limit) {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * Sanitize HTML string to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string} - Sanitized string
   */
  sanitizeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
  
  /**
   * Format time string
   * @param {string} time - Time in HH:MM format
   * @param {string} format - Format type ('24h' or '12h')
   * @returns {string} - Formatted time string
   */
  formatTime(time, format = '24h') {
    if (!time) return '';
    
    if (format === '12h') {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  },
  
  /**
   * Parse date string in YYYY-MM-DD format
   * @param {string} dateString - Date string
   * @returns {Date} - Date object
   */
  parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  },
  
  /**
   * Storage helpers for localStorage
   */
  storage: {
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} - Stored value or default
     */
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Storage get error:', error);
        return defaultValue;
      }
    },
    
    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} - Success status
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Storage set error:', error);
        return false;
      }
    },
    
    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Storage remove error:', error);
        return false;
      }
    }
  },
  
  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} - Success status
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  },
  
  /**
   * Calculate duration between two times
   * @param {string} startTime - Start time (HH:MM)
   * @param {string} endTime - End time (HH:MM)
   * @returns {number} - Duration in minutes
   */
  calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return endTotalMinutes - startTotalMinutes;
  },
  
  /**
   * Check if current time is between start and end time
   * @param {string} startTime - Start time (HH:MM)
   * @param {string} endTime - End time (HH:MM)
   * @returns {boolean} - True if current time is in range
   */
  isCurrentlyActive(startTime, endTime) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (endTime) {
      return currentTime >= startTime && currentTime < endTime;
    }
    
    return currentTime === startTime;
  },
  
  /**
   * Get current date in YYYY-MM-DD format
   * @returns {string} - Current date
   */
  getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  
  /**
   * Create element with classes and attributes
   * @param {string} tag - HTML tag name
   * @param {Object} options - Options object
   * @param {string|Array} options.classes - CSS classes
   * @param {Object} options.attrs - Attributes object
   * @param {string} options.html - Inner HTML
   * @param {string} options.text - Inner text
   * @returns {HTMLElement} - Created element
   */
  createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.classes) {
      const classes = Array.isArray(options.classes) ? options.classes : [options.classes];
      element.className = classes.join(' ');
    }
    
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (options.html) {
      element.innerHTML = options.html;
    } else if (options.text) {
      element.textContent = options.text;
    }
    
    return element;
  }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
