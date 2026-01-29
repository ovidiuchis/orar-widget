# Implementation Patterns & Best Practices

## 🎨 CSS Architecture Pattern

### Base Structure

```css
/* base.css - Mobile-first approach */

:root {
  /* Spacing system */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}

/* Widget container - scoped */
.schedule-widget {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--background);
}

/* Activity card - mobile first */
.schedule-widget__activity-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--radius-md);
  background: var(--card-background);
  border-left: 4px solid var(--activity-color);
  transition: all var(--transition-base);
}

.schedule-widget__activity-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive breakpoints */
@media (min-width: 768px) {
  .schedule-widget__activity-card {
    padding: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .schedule-widget__activity-card {
    gap: var(--spacing-lg);
  }
}
```

### Theme Pattern - Mountain Retreat

```css
/* themes/mountain-retreat.css */

.schedule-widget--theme-mountain-retreat {
  /* Color palette */
  --color-primary: #2d5016;      /* Forest green */
  --color-secondary: #8b7355;    /* Warm brown */
  --color-accent: #d4a574;       /* Soft gold */
  
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --text-muted: #999;
  
  --background: #faf8f5;         /* Warm off-white */
  --background-elevated: #ffffff;
  --card-background: #ffffff;
  
  /* Activity type colors */
  --activity-logistics: #9ca3af;
  --activity-session: #3b82f6;
  --activity-meal: #f59e0b;
  --activity-break: #fde68a;
  --activity-worship: #8b5cf6;
  --activity-recreation: #10b981;
  --activity-meeting: #ec4899;
  --activity-other: #6b7280;
  
  /* Nature-inspired accents */
  --border-color: rgba(45, 80, 22, 0.1);
  --shadow-color: rgba(45, 80, 22, 0.08);
}

/* Custom styles for this theme */
.schedule-widget--theme-mountain-retreat .schedule-widget__day-tab {
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.schedule-widget--theme-mountain-retreat .schedule-widget__activity-icon {
  filter: drop-shadow(2px 2px 4px rgba(45, 80, 22, 0.2));
}
```

---

## 🔧 JavaScript Module Pattern

### Main Widget Module

```javascript
/**
 * Schedule Widget - Main Module
 * Zero dependencies, vanilla JavaScript ES6+
 */

const ScheduleWidget = (() => {
  // Private state
  const state = {
    config: null,
    data: null,
    container: null,
    currentDay: null,
    currentTheme: null,
    listeners: []
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

  // Import utilities
  const { $, $$, debounce, sanitizeHTML, formatTime, storage } = Utils;

  // ========================================
  // VALIDATION
  // ========================================

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

    // Initialize first day
    if (config.displayMode === 'tabs') {
      showDay(data.days[0].id);
    }

    // Setup current time highlight
    if (config.options.highlightCurrent) {
      highlightCurrentActivity();
      // Update every minute
      const intervalId = setInterval(highlightCurrentActivity, 60000);
      state.listeners.push(() => clearInterval(intervalId));
    }
  };

  const createHeader = (eventInfo, config) => {
    const header = document.createElement('div');
    header.className = 'schedule-widget__header';

    header.innerHTML = `
      <div class="schedule-widget__header-content">
        <h1 class="schedule-widget__title">${sanitizeHTML(eventInfo.title)}</h1>
        ${eventInfo.subtitle ? `<p class="schedule-widget__subtitle">${sanitizeHTML(eventInfo.subtitle)}</p>` : ''}
        <div class="schedule-widget__meta">
          <span class="schedule-widget__date-range">${sanitizeHTML(eventInfo.dateRange)}</span>
          ${eventInfo.location ? `<span class="schedule-widget__location">📍 ${sanitizeHTML(eventInfo.location)}</span>` : ''}
        </div>
      </div>
    `;

    // Add controls
    if (config.options.showSearch || config.options.enableExport) {
      const controls = document.createElement('div');
      controls.className = 'schedule-widget__header-controls';

      if (config.options.showSearch) {
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.className = 'schedule-widget__search';
        searchInput.placeholder = 'Caută activități...';
        searchInput.addEventListener('input', debounce((e) => {
          searchActivities(e.target.value);
        }, 300));
        controls.appendChild(searchInput);
      }

      if (config.options.enableExport) {
        const exportBtn = document.createElement('button');
        exportBtn.className = 'schedule-widget__export-btn';
        exportBtn.textContent = '📅 Export Calendar';
        exportBtn.addEventListener('click', exportCalendar);
        controls.appendChild(exportBtn);
      }

      header.appendChild(controls);
    }

    return header;
  };

  const createActivityCard = (activity, activityTypes, options) => {
    const type = activityTypes[activity.type] || activityTypes.other;
    const card = document.createElement('div');
    card.className = 'schedule-widget__activity-card';
    card.dataset.activityId = activity.id;
    card.dataset.activityType = activity.type;
    card.dataset.startTime = activity.startTime;
    card.dataset.endTime = activity.endTime || '';

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
          ${activity.speakers.map(s => `<span class="schedule-widget__speaker">${sanitizeHTML(s.name)}</span>`).join(', ')}
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

    // Add click handler for details
    card.addEventListener('click', () => {
      showActivityDetails(activity);
    });

    return card;
  };

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const showDay = (dayId) => {
    state.currentDay = dayId;

    // Update navigation
    $$('.schedule-widget__day-tab').forEach(tab => {
      tab.classList.toggle('schedule-widget__day-tab--active', tab.dataset.dayId === dayId);
    });

    // Show/hide day content
    $$('.schedule-widget__day').forEach(day => {
      day.style.display = day.dataset.dayId === dayId ? 'block' : 'none';
    });

    // Save preference
    storage.set('schedule-widget-current-day', dayId);
  };

  const searchActivities = (query) => {
    const lowerQuery = query.toLowerCase().trim();

    $$('.schedule-widget__activity-card').forEach(card => {
      if (!lowerQuery) {
        card.style.display = '';
        return;
      }

      const title = $('.schedule-widget__activity-title', card).textContent.toLowerCase();
      const description = $('.schedule-widget__activity-description', card)?.textContent.toLowerCase() || '';
      const speakers = Array.from($$('.schedule-widget__speaker', card)).map(s => s.textContent.toLowerCase()).join(' ');

      const matches = title.includes(lowerQuery) || 
                     description.includes(lowerQuery) || 
                     speakers.includes(lowerQuery);

      card.style.display = matches ? '' : 'none';
    });
  };

  const highlightCurrentActivity = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    $$('.schedule-widget__activity-card').forEach(card => {
      const startTime = card.dataset.startTime;
      const endTime = card.dataset.endTime;

      const isActive = endTime 
        ? currentTime >= startTime && currentTime <= endTime
        : currentTime === startTime;

      card.classList.toggle('schedule-widget__activity-card--current', isActive);
    });
  };

  // ========================================
  // PUBLIC API
  // ========================================

  return {
    /**
     * Initialize the schedule widget
     * @param {Object} userConfig - Configuration object
     * @returns {ScheduleWidget} Widget instance
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
              <h3>Unable to load schedule</h3>
              <p>${sanitizeHTML(error.message)}</p>
            </div>
          `;
        }
        
        throw error;
      }
    },

    /**
     * Update widget data
     * @param {Object} newData - New schedule data
     */
    update(newData) {
      validateData(newData);
      state.data = newData;
      render();
    },

    /**
     * Change theme
     * @param {string} themeName - Theme name
     */
    setTheme(themeName) {
      state.config.theme = themeName;
      state.container.className = state.container.className.replace(
        /schedule-widget--theme-\S+/,
        `schedule-widget--theme-${themeName}`
      );
    },

    /**
     * Destroy widget and cleanup
     */
    destroy() {
      // Remove event listeners
      state.listeners.forEach(cleanup => cleanup());
      
      // Clear container
      if (state.container) {
        state.container.innerHTML = '';
      }

      // Reset state
      Object.keys(state).forEach(key => state[key] = null);
      state.listeners = [];

      console.info('[ScheduleWidget] Destroyed');
    }
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleWidget;
}
```

---

## 🎯 Key Takeaways

1. **Validation First** - Always validate configuration and data before rendering
2. **Error Handling** - Graceful degradation with user-friendly error messages
3. **State Management** - Use private state object with public API methods
4. **Event Cleanup** - Track listeners and provide destroy method
5. **Utilities Reuse** - Extract common operations into utility functions
6. **CSS Variables** - Use custom properties for theming
7. **Mobile-First** - Base styles for mobile, enhance for larger screens
8. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
9. **Performance** - Debounce search, minimal DOM manipulation
10. **Documentation** - JSDoc comments for all public methods
