/**
 * Schedule Widget - Main Module
 * A highly polished, embeddable JavaScript widget for rendering event schedules
 * 
 * @version 1.0.0
 * @author Schedule Widget Team
 * @license MIT
 */

const ScheduleWidget = (() => {
  'use strict';

  // Private state
  const state = {
    config: null,
    data: null,
    container: null,
    currentDay: null,
    currentTheme: null,
    listeners: [],
    modalElement: null
  };

  // Default configuration
  const defaultConfig = {
    theme: 'mountain-retreat',
    displayMode: 'tabs',
    options: {
      showSearch: false,
      enableExport: false,
      showIcons: true,
      language: 'ro',
      timeFormat: '24h',
      highlightCurrent: true,
      showEndTimes: true,
      showSpeakers: true,
      showLocations: true
    }
  };

  // Default activity types
  const defaultActivityTypes = {
    logistics: { color: '#9CA3AF', icon: '📋', label: 'Logistică' },
    session: { color: '#3B82F6', icon: '📖', label: 'Sesiune' },
    meal: { color: '#F59E0B', icon: '🍽️', label: 'Masă' },
    break: { color: '#FDE68A', icon: '☕', label: 'Pauză' },
    worship: { color: '#8B5CF6', icon: '🙏', label: 'Închinare' },
    recreation: { color: '#10B981', icon: '⚽', label: 'Recreere' },
    meeting: { color: '#EC4899', icon: '👥', label: 'Întâlnire' },
    other: { color: '#6B7280', icon: '📌', label: 'Altele' }
  };

  // Import utilities
  const { $, $$, debounce, sanitizeHTML, formatTime, storage, createElement, isCurrentlyActive } = Utils;

  // ========================================
  // VALIDATION
  // ========================================

  /**
   * Validate configuration object
   * @param {Object} config - Configuration to validate
   * @returns {HTMLElement} - Container element
   * @throws {Error} - If configuration is invalid
   */
  const validateConfig = (config) => {
    if (!config || typeof config !== 'object') {
      throw new Error('Configuration must be an object');
    }

    if (!config.containerId || typeof config.containerId !== 'string') {
      throw new Error('containerId is required and must be a string');
    }

    const container = document.getElementById(config.containerId);
    if (!container) {
      throw new Error(`Container element with id "${config.containerId}" not found`);
    }

    if (!config.data || typeof config.data !== 'object') {
      throw new Error('data is required and must be an object');
    }

    return container;
  };

  /**
   * Validate schedule data
   * @param {Object} data - Schedule data to validate
   * @returns {boolean} - True if valid
   * @throws {Error} - If data is invalid
   */
  const validateData = (data) => {
    // Event info validation
    if (!data.eventInfo || !data.eventInfo.title || !data.eventInfo.dateRange) {
      throw new Error('Invalid data: eventInfo.title and eventInfo.dateRange are required');
    }

    // Days validation
    if (!Array.isArray(data.days) || data.days.length === 0) {
      throw new Error('Invalid data: days must be a non-empty array');
    }

    // Validate each day
    data.days.forEach((day, dayIndex) => {
      if (!day.id || !day.date || !day.dayLabel) {
        throw new Error(`Invalid day at index ${dayIndex}: id, date, and dayLabel are required`);
      }

      if (!Array.isArray(day.activities)) {
        throw new Error(`Invalid day at index ${dayIndex}: activities must be an array`);
      }

      // Validate each activity
      day.activities.forEach((activity, actIndex) => {
        if (!activity.id || !activity.startTime || !activity.title || !activity.type) {
          throw new Error(`Invalid activity at day ${dayIndex}, activity ${actIndex}: id, startTime, title, and type are required`);
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(activity.startTime)) {
          throw new Error(`Invalid startTime format at day ${dayIndex}, activity ${actIndex}: must be HH:MM`);
        }

        if (activity.endTime && !timeRegex.test(activity.endTime)) {
          throw new Error(`Invalid endTime format at day ${dayIndex}, activity ${actIndex}: must be HH:MM`);
        }
      });
    });

    return true;
  };

  // ========================================
  // RENDERING
  // ========================================

  /**
   * Main render function
   */
  const render = () => {
    const { data, config, container } = state;

    // Clear container
    container.innerHTML = '';
    container.className = `schedule-widget schedule-widget--theme-${config.theme} schedule-widget--mode-${config.displayMode}`;

    // Create header
    const header = createHeader(data.eventInfo, config);
    container.appendChild(header);

    // Create day navigation (for tabs mode)
    if (config.displayMode === 'tabs') {
      const nav = createDayNavigation(data.days);
      container.appendChild(nav);
    }

    // Create days container
    const daysContainer = createDaysContainer(data.days, config);
    container.appendChild(daysContainer);

    // Initialize display mode
    initializeDisplayMode(config.displayMode, data.days);

    // Setup current time highlight
    if (config.options.highlightCurrent) {
      highlightCurrentActivity();
      // Update every minute
      const intervalId = setInterval(highlightCurrentActivity, 60000);
      state.listeners.push(() => clearInterval(intervalId));
    }
  };

  /**
   * Create header section
   */
  const createHeader = (eventInfo, config) => {
    const header = createElement('div', { classes: 'schedule-widget__header' });

    const headerContent = createElement('div', {
      classes: 'schedule-widget__header-content',
      html: `
        <h1 class="schedule-widget__title">${sanitizeHTML(eventInfo.title)}</h1>
        ${eventInfo.subtitle ? `<p class="schedule-widget__subtitle">${sanitizeHTML(eventInfo.subtitle)}</p>` : ''}
        <div class="schedule-widget__meta">
          <span class="schedule-widget__date-range">📅 ${sanitizeHTML(eventInfo.dateRange)}</span>
          ${eventInfo.location ? `<span class="schedule-widget__location">📍 ${sanitizeHTML(eventInfo.location)}</span>` : ''}
        </div>
      `
    });

    header.appendChild(headerContent);

    // Add controls
    if (config.options.showSearch || config.options.enableExport) {
      const controls = createElement('div', { classes: 'schedule-widget__header-controls' });

      if (config.options.showSearch) {
        const searchInput = createElement('input', {
          attrs: {
            type: 'search',
            placeholder: config.options.language === 'ro' ? 'Caută activități...' : 'Search activities...',
            'aria-label': config.options.language === 'ro' ? 'Caută activități' : 'Search activities'
          },
          classes: 'schedule-widget__search'
        });
        
        searchInput.addEventListener('input', debounce((e) => {
          searchActivities(e.target.value);
        }, 300));
        
        controls.appendChild(searchInput);
      }

      if (config.options.enableExport) {
        const exportBtn = createElement('button', {
          classes: 'schedule-widget__export-btn',
          text: '📅 Export Calendar',
          attrs: {
            'aria-label': 'Export to calendar'
          }
        });
        
        exportBtn.addEventListener('click', exportCalendar);
        controls.appendChild(exportBtn);
      }

      header.appendChild(controls);
    }

    return header;
  };

  /**
   * Create day navigation (tabs)
   */
  const createDayNavigation = (days) => {
    const nav = createElement('nav', {
      classes: 'schedule-widget__day-navigation',
      attrs: {
        role: 'tablist',
        'aria-label': 'Days'
      }
    });

    days.forEach((day, index) => {
      const tab = createElement('button', {
        classes: 'schedule-widget__day-tab',
        attrs: {
          'data-day-id': day.id,
          role: 'tab',
          'aria-selected': index === 0 ? 'true' : 'false',
          'aria-controls': `panel-${day.id}`,
          id: `tab-${day.id}`
        },
        html: `
          <span class="schedule-widget__day-tab-label">${sanitizeHTML(day.dayLabel)}</span>
          ${day.theme ? `<span class="schedule-widget__day-tab-theme">${sanitizeHTML(day.theme)}</span>` : ''}
        `
      });

      tab.addEventListener('click', () => showDay(day.id));
      nav.appendChild(tab);
    });

    return nav;
  };

  /**
   * Create days container with all activities
   */
  const createDaysContainer = (days, config) => {
    const container = createElement('div', { classes: 'schedule-widget__days' });
    const activityTypes = state.data.activityTypes || defaultActivityTypes;

    days.forEach((day, index) => {
      const dayElement = createElement('div', {
        classes: `schedule-widget__day ${config.displayMode === 'accordion' ? 'schedule-widget__day--accordion' : ''}`,
        attrs: {
          'data-day-id': day.id,
          'data-day-date': day.date,
          role: config.displayMode === 'tabs' ? 'tabpanel' : 'region',
          'aria-labelledby': `tab-${day.id}`,
          id: `panel-${day.id}`
        }
      });

      // Create day header
      if (config.displayMode === 'accordion' || config.displayMode === 'full-scroll' || config.displayMode === 'timeline') {
        const dayHeader = createElement('div', {
          classes: 'schedule-widget__day-header',
          attrs: config.displayMode === 'accordion' ? {
            role: 'button',
            'aria-expanded': index === 0 ? 'true' : 'false',
            tabindex: '0'
          } : {},
          html: `
            <h2 class="schedule-widget__day-title">${sanitizeHTML(day.dayLabel)}</h2>
            ${day.theme ? `<p class="schedule-widget__day-theme">${sanitizeHTML(day.theme)}</p>` : ''}
            ${config.displayMode === 'accordion' ? '<span class="schedule-widget__day-toggle" aria-hidden="true">▼</span>' : ''}
          `
        });

        if (config.displayMode === 'accordion') {
          dayHeader.addEventListener('click', () => toggleAccordion(day.id));
          dayHeader.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleAccordion(day.id);
            }
          });
        }

        dayElement.appendChild(dayHeader);
      }

      // Create activities container
      const activitiesContainer = createElement('div', {
        classes: `schedule-widget__activities ${config.displayMode === 'timeline' ? 'schedule-widget__activities--timeline' : ''}`
      });

      day.activities.forEach(activity => {
        const card = createActivityCard(activity, activityTypes, config.options);
        activitiesContainer.appendChild(card);
      });

      dayElement.appendChild(activitiesContainer);
      container.appendChild(dayElement);
    });

    return container;
  };

  /**
   * Create activity card element
   */
  const createActivityCard = (activity, activityTypes, options) {
    const type = activityTypes[activity.type] || activityTypes.other;
    const card = createElement('div', {
      classes: `schedule-widget__activity-card ${activity.isOptional ? 'schedule-widget__activity-card--optional' : ''}`,
      attrs: {
        'data-activity-id': activity.id,
        'data-activity-type': activity.type,
        'data-start-time': activity.startTime,
        'data-end-time': activity.endTime || ''
      }
    });

    // Apply activity color
    card.style.setProperty('--activity-color', type.color);

    // Build card HTML
    let cardHTML = `
      <div class="schedule-widget__activity-time">
        <span class="schedule-widget__time-start">${formatTime(activity.startTime, options.timeFormat)}</span>
        ${options.showEndTimes && activity.endTime ? `
          <span class="schedule-widget__time-separator">-</span>
          <span class="schedule-widget__time-end">${formatTime(activity.endTime, options.timeFormat)}</span>
        ` : ''}
      </div>
      <div class="schedule-widget__activity-content">
        <div class="schedule-widget__activity-header">
          ${options.showIcons && activity.icon ? `
            <span class="schedule-widget__activity-icon" aria-hidden="true">${activity.icon}</span>
          ` : ''}
          <h3 class="schedule-widget__activity-title">${sanitizeHTML(activity.title)}</h3>
          ${activity.isOptional ? '<span class="schedule-widget__activity-badge">Opțional</span>' : ''}
        </div>
    `;

    if (activity.description) {
      cardHTML += `<p class="schedule-widget__activity-description">${sanitizeHTML(activity.description)}</p>`;
    }

    if (options.showSpeakers && activity.speakers && activity.speakers.length > 0) {
      cardHTML += `
        <div class="schedule-widget__activity-speakers">
          <span class="schedule-widget__speakers-label">🎤</span>
          ${activity.speakers.map(s => `<span class="schedule-widget__speaker">${sanitizeHTML(s.name)}${s.role ? ` (${sanitizeHTML(s.role)})` : ''}</span>`).join(', ')}
        </div>
      `;
    }

    if (options.showLocations && activity.location) {
      cardHTML += `
        <div class="schedule-widget__activity-location">
          📍 ${sanitizeHTML(activity.location)}
        </div>
      `;
    }

    cardHTML += `</div>`; // Close content div
    card.innerHTML = cardHTML;

    return card;
  };

  // ========================================
  // DISPLAY MODE INITIALIZATION
  // ========================================

  /**
   * Initialize the selected display mode
   */
  const initializeDisplayMode = (mode, days) => {
    switch (mode) {
      case 'tabs':
        // Show first day by default
        const savedDay = storage.get('schedule-widget-current-day');
        const initialDay = savedDay && days.find(d => d.id === savedDay) ? savedDay : days[0].id;
        showDay(initialDay);
        break;
        
      case 'accordion':
        // Expand first day and show all days
        $$('.schedule-widget__day').forEach((day, index) => {
          day.style.display = 'block'; // Make sure day is visible
          const isFirst = index === 0;
          day.classList.toggle('schedule-widget__day--expanded', isFirst);
          const header = $('.schedule-widget__day-header', day);
          if (header) {
            header.setAttribute('aria-expanded', isFirst ? 'true' : 'false');
          }
        });
        break;
        
      case 'full-scroll':
      case 'timeline':
        // All days visible by default
        $$('.schedule-widget__day').forEach(day => {
          day.style.display = 'block';
        });
        break;
    }
  };

  /**
   * Show specific day (tabs mode)
   */
  const showDay = (dayId) => {
    state.currentDay = dayId;

    // Update navigation
    $$('.schedule-widget__day-tab').forEach(tab => {
      const isActive = tab.dataset.dayId === dayId;
      tab.classList.toggle('schedule-widget__day-tab--active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Show/hide day content
    $$('.schedule-widget__day').forEach(day => {
      const shouldShow = day.dataset.dayId === dayId;
      day.style.display = shouldShow ? 'block' : 'none';
      day.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    });

    // Save preference
    storage.set('schedule-widget-current-day', dayId);
    
    // Trigger callback if provided
    if (state.config.callbacks && state.config.callbacks.onDayChange) {
      state.config.callbacks.onDayChange(dayId);
    }
  };

  /**
   * Toggle accordion day
   */
  const toggleAccordion = (dayId) => {
    const dayElement = $(`.schedule-widget__day[data-day-id="${dayId}"]`);
    if (!dayElement) return;

    const isExpanded = dayElement.classList.contains('schedule-widget__day--expanded');
    dayElement.classList.toggle('schedule-widget__day--expanded');
    
    const header = $('.schedule-widget__day-header', dayElement);
    if (header) {
      header.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    }
  };

  // ========================================
  // SEARCH & FILTER
  // ========================================

  /**
   * Search activities by query
   */
  const searchActivities = (query) => {
    const lowerQuery = query.toLowerCase().trim();

    $$('.schedule-widget__activity-card').forEach(card => {
      if (!lowerQuery) {
        card.style.display = '';
        card.classList.remove('schedule-widget__activity-card--hidden');
        return;
      }

      const title = $('.schedule-widget__activity-title', card)?.textContent.toLowerCase() || '';
      const description = $('.schedule-widget__activity-description', card)?.textContent.toLowerCase() || '';
      const speakers = Array.from($$('.schedule-widget__speaker', card))
        .map(s => s.textContent.toLowerCase())
        .join(' ');
      const location = $('.schedule-widget__activity-location', card)?.textContent.toLowerCase() || '';

      const matches = title.includes(lowerQuery) || 
                     description.includes(lowerQuery) || 
                     speakers.includes(lowerQuery) ||
                     location.includes(lowerQuery);

      card.style.display = matches ? '' : 'none';
      card.classList.toggle('schedule-widget__activity-card--hidden', !matches);
    });
  };

  // ========================================
  // CURRENT ACTIVITY HIGHLIGHT
  // ========================================

  /**
   * Highlight currently active activity
   */
  const highlightCurrentActivity = () => {
    const currentDate = Utils.getCurrentDate();

    $$('.schedule-widget__activity-card').forEach(card => {
      const dayElement = card.closest('.schedule-widget__day');
      const dayDate = dayElement?.dataset.dayDate;
      
      // Only highlight if it's today
      if (dayDate === currentDate) {
        const startTime = card.dataset.startTime;
        const endTime = card.dataset.endTime;
        const isActive = isCurrentlyActive(startTime, endTime);
        
        card.classList.toggle('schedule-widget__activity-card--current', isActive);
        
        if (isActive) {
          card.setAttribute('aria-current', 'true');
        } else {
          card.removeAttribute('aria-current');
        }
      }
    });
  };

  // ========================================
  // ACTIVITY DETAILS MODAL
  // ========================================

  /**
   * Show activity details in modal
   */
  const showActivityDetails = (activity, type) => {
    // Remove existing modal if any
    if (state.modalElement) {
      state.modalElement.remove();
    }

    const modal = createElement('div', {
      classes: 'schedule-widget__modal',
      attrs: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'modal-title'
      }
    });

    const modalContent = createElement('div', {
      classes: 'schedule-widget__modal-content',
      html: `
        <button class="schedule-widget__modal-close" aria-label="Close">✕</button>
        <div class="schedule-widget__modal-header" style="border-left-color: ${type.color}">
          ${activity.icon ? `<span class="schedule-widget__modal-icon">${activity.icon}</span>` : ''}
          <h2 id="modal-title" class="schedule-widget__modal-title">${sanitizeHTML(activity.title)}</h2>
        </div>
        <div class="schedule-widget__modal-body">
          <div class="schedule-widget__modal-time">
            <strong>⏰ Ora:</strong> ${formatTime(activity.startTime, state.config.options.timeFormat)}${activity.endTime ? ` - ${formatTime(activity.endTime, state.config.options.timeFormat)}` : ''}
          </div>
          ${activity.location ? `
            <div class="schedule-widget__modal-location">
              <strong>📍 Locație:</strong> ${sanitizeHTML(activity.location)}
            </div>
          ` : ''}
          ${activity.description ? `
            <div class="schedule-widget__modal-description">
              <strong>Descriere:</strong>
              <p>${sanitizeHTML(activity.description)}</p>
            </div>
          ` : ''}
          ${activity.speakers && activity.speakers.length > 0 ? `
            <div class="schedule-widget__modal-speakers">
              <strong>🎤 Vorbitori:</strong>
              <ul>
                ${activity.speakers.map(s => `
                  <li>${sanitizeHTML(s.name)}${s.role ? ` - ${sanitizeHTML(s.role)}` : ''}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          ${activity.isOptional ? `
            <div class="schedule-widget__modal-note">
              <em>📌 Această activitate este opțională</em>
            </div>
          ` : ''}
        </div>
      `
    });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    state.modalElement = modal;

    // Close handlers
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    const closeModal = () => {
      modal.classList.add('schedule-widget__modal--closing');
      document.removeEventListener('keydown', handleKeydown);
      setTimeout(() => {
        modal.remove();
        state.modalElement = null;
      }, 200);
    };

    $('.schedule-widget__modal-close', modal).addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Keyboard handler
    document.addEventListener('keydown', handleKeydown);

    // Focus trap
    const focusableElements = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Trigger callback
    if (state.config.callbacks && state.config.callbacks.onActivityClick) {
      state.config.callbacks.onActivityClick(activity);
    }
  };

  // ========================================
  // EXPORT TO CALENDAR
  // ========================================

  /**
   * Export schedule to iCal format
   */
  const exportCalendar = () => {
    const { eventInfo, days } = state.data;
    
    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Schedule Widget//EN',
      `X-WR-CALNAME:${eventInfo.title}`,
      'X-WR-TIMEZONE:' + (eventInfo.timezone || 'Europe/Bucharest'),
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    days.forEach(day => {
      day.activities.forEach(activity => {
        // Format date and time for iCal (YYYYMMDDTHHMMSS)
        const startDateTime = `${day.date.replace(/-/g, '')}T${activity.startTime.replace(':', '')}00`;
        const endDateTime = activity.endTime 
          ? `${day.date.replace(/-/g, '')}T${activity.endTime.replace(':', '')}00`
          : startDateTime;

        ical.push(
          'BEGIN:VEVENT',
          `UID:${activity.id}@schedule-widget`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTSTART:${startDateTime}`,
          `DTEND:${endDateTime}`,
          `SUMMARY:${escapeICalText(activity.title)}`,
          activity.description ? `DESCRIPTION:${escapeICalText(activity.description)}` : '',
          activity.location ? `LOCATION:${escapeICalText(activity.location)}` : '',
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      });
    });

    ical.push('END:VCALENDAR');

    // Create and download file
    const blob = new Blob([ical.filter(line => line).join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventInfo.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Escape text for iCal format
   */
  const escapeICalText = (text) => {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  };

  // ========================================
  // PUBLIC API
  // ========================================

  return {
    /**
     * Initialize the schedule widget
     * @param {Object} userConfig - Configuration object
     * @param {string} userConfig.containerId - DOM element ID for widget container
     * @param {Object} userConfig.data - Schedule data object
     * @param {string} userConfig.theme - Theme name (mountain-retreat, professional, etc.)
     * @param {string} userConfig.displayMode - Display mode (tabs, accordion, full-scroll, timeline)
     * @param {Object} [userConfig.options] - Optional configuration
     * @returns {ScheduleWidget} - Widget instance for chaining
     * @throws {Error} - If configuration is invalid
     */
    init(userConfig) {
      try {
        // Validate configuration
        state.container = validateConfig(userConfig);
        
        // Merge with defaults
        state.config = {
          ...defaultConfig,
          ...userConfig,
          options: {
            ...defaultConfig.options,
            ...(userConfig.options || {})
          }
        };
        
        state.data = userConfig.data;

        // Validate data
        validateData(state.data);

        // Render
        render();

        console.info('[ScheduleWidget] Initialized successfully');
        return this;

      } catch (error) {
        console.error('[ScheduleWidget] Initialization error:', error);
        
        // Show error in container
        if (state.container) {
          state.container.innerHTML = `
            <div class="schedule-widget__error">
              <h3>❌ Unable to load schedule</h3>
              <p>${sanitizeHTML(error.message)}</p>
            </div>
          `;
          // Log stack trace to console for debugging
          console.error('[ScheduleWidget] Stack trace:', error);
        }
        
        throw error;
      }
    },

    /**
     * Update widget data
     * @param {Object} newData - New schedule data
     * @returns {ScheduleWidget} - Widget instance for chaining
     */
    update(newData) {
      validateData(newData);
      state.data = newData;
      render();
      return this;
    },

    /**
     * Change theme
     * @param {string} themeName - Theme name
     * @returns {ScheduleWidget} - Widget instance for chaining
     */
    setTheme(themeName) {
      state.config.theme = themeName;
      state.container.className = state.container.className.replace(
        /schedule-widget--theme-\S+/,
        `schedule-widget--theme-${themeName}`
      );
      return this;
    },

    /**
     * Change display mode
     * @param {string} mode - Display mode (tabs, accordion, full-scroll, timeline)
     * @returns {ScheduleWidget} - Widget instance for chaining
     */
    setDisplayMode(mode) {
      state.config.displayMode = mode;
      render();
      return this;
    },

    /**
     * Get current state
     * @returns {Object} - Current state object
     */
    getState() {
      return {
        theme: state.config.theme,
        displayMode: state.config.displayMode,
        currentDay: state.currentDay
      };
    },

    /**
     * Destroy widget and cleanup
     */
    destroy() {
      // Remove event listeners
      state.listeners.forEach(cleanup => cleanup());
      
      // Remove modal if exists
      if (state.modalElement) {
        state.modalElement.remove();
      }
      
      // Clear container
      if (state.container) {
        state.container.innerHTML = '';
        state.container.className = '';
      }

      // Reset state
      Object.keys(state).forEach(key => {
        if (key === 'listeners') {
          state[key] = [];
        } else {
          state[key] = null;
        }
      });

      console.info('[ScheduleWidget] Destroyed');
    }
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleWidget;
}
