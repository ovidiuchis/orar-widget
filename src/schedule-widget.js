/**
 * Schedule Widget - Main Module
 */
import Utils from './utilities.js';
import { Header } from './components/header.js';
import { DayNavigation } from './components/day-navigation.js';
import { ActivityCard } from './components/activity-card.js';

class ScheduleWidget {
    constructor(config = null) {
        this.state = {
            config: null,
            data: null,
            container: null,
            currentDayId: null,
            currentTheme: null,
            searchQuery: '',
            listeners: []
        };

        this.dom = {
            header: null,
            nav: null,
            content: null
        };

        this.defaultConfig = {
            theme: 'outdoor',
            displayMode: 'tabs',
            options: {
                showSearch: false, // Default off, enabled via parameter
                showThemeToggle: false,
                showIcons: true,
                language: 'ro',
                timeFormat: '24h',
                highlightCurrent: true,
                showEndTimes: true,
                showSpeakers: true,
                showLocations: true
            }
        };

        if (config) {
            this.init(config);
        }
    }

    // ========================================
    // VALIDATION
    // ========================================

    validateConfig(config) {
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
    }

    validateData(data) {
        if (!data.eventInfo || !data.eventInfo.title) {
            throw new Error('Invalid data: eventInfo.title is required');
        }
        if (!Array.isArray(data.days) || data.days.length === 0) {
            throw new Error('Invalid data: days must be a non-empty array');
        }
        return true;
    }

    // ========================================
    // INIT
    // ========================================

    init(userConfig) {
        try {
            this.state.container = this.validateConfig(userConfig);

            this.state.config = {
                ...this.defaultConfig,
                ...userConfig,
                options: {
                    ...this.defaultConfig.options,
                    ...(userConfig.options || {})
                }
            };

            this.state.data = userConfig.data;
            this.validateData(this.state.data);

            // Set initial day
            this.state.currentDayId = this.state.config.currentDayId || this.state.data.days[0].id;

            // Initial render
            this.buildLayout();
            this.updateContent();

            console.info('[ScheduleWidget] Initialized successfully');
            return this;

        } catch (error) {
            console.error('[ScheduleWidget] Initialization error:', error);
            if (this.state.container) {
                this.state.container.innerHTML = `<div style="color:red; padding:20px;">Error: ${error.message}</div>`;
            }
            throw error;
        }
    }

    // ========================================
    // CORE RENDER
    // ========================================

    buildLayout() {
        const { data, config, container, currentDayId } = this.state;

        // Clear container once
        container.innerHTML = '';

        // Container Classes
        container.className = `schedule-widget schedule-widget--theme-${config.theme} schedule-widget--mode-${config.displayMode}`;

        // 1. Header
        const header = Header(data.eventInfo, config, {
            onSearch: (query) => this.handleSearch(query)
        });
        container.appendChild(header);
        this.dom.header = header;

        // 2. Navigation (Tabs)
        if (config.displayMode === 'tabs') {
            const nav = DayNavigation(data.days, currentDayId, {
                onDayChange: (dayId) => this.handleDayChange(dayId)
            });
            container.appendChild(nav);
            this.dom.nav = nav;
        }

        // 3. Main Content Area (Days) wrapper
        const contentArea = document.createElement('div');
        contentArea.className = 'schedule-widget__content';
        container.appendChild(contentArea);
        this.dom.content = contentArea;
    }

    updateContent() {
        const { data, config, currentDayId } = this.state;
        const contentArea = this.dom.content;

        if (!contentArea) return;

        contentArea.innerHTML = ''; // Clear only content

        data.days.forEach(day => {
            // Calculate filtered activities first to check if day has matches
            const filteredActivities = this.filterActivities(day.activities);
            const isSearching = !!this.state.searchQuery;

            // Mode Logic:
            // 1. If searching: Show day ONLY if it has matches.
            // 2. If NOT searching: Respect Tabs mode (only show current day) or List mode (show all).

            if (isSearching) {
                if (filteredActivities.length === 0) return; // Skip days with no matches
            } else {
                if (config.displayMode === 'tabs' && day.id !== currentDayId) {
                    return; // Skip non-active days in tabs mode
                }
            }

            const dayContainer = document.createElement('div');
            dayContainer.className = 'schedule-widget__day';
            dayContainer.dataset.dayId = day.id;

            // Day Header (visible in all modes except pure tabs maybe, but good for context)
            if (config.displayMode !== 'tabs') {
                const dayHeader = document.createElement('h2');
                dayHeader.className = 'schedule-widget__day-header';
                dayHeader.textContent = day.dayLabel;
                dayHeader.style.padding = 'var(--spacing-md) 0';
                dayHeader.style.borderBottom = '1px solid #eee';
                dayContainer.appendChild(dayHeader);
            }

            // Activities
            const activitiesContainer = document.createElement('div');
            activitiesContainer.className = 'schedule-widget__activities';
            activitiesContainer.style.marginTop = 'var(--spacing-md)';

            if (day.activities && day.activities.length > 0) {
                // filteredActivities is already calculated at start of loop

                if (filteredActivities.length === 0) {
                    activitiesContainer.innerHTML = '<div class="schedule-widget__empty">No activities found matching criteria.</div>';
                } else {
                    filteredActivities.forEach(activity => {
                        const card = ActivityCard(activity, data.activityTypes || {}, config.options, {
                            onClick: (act) => this.handleActivityClick(act)
                        });
                        activitiesContainer.appendChild(card);
                    });
                }
            } else {
                activitiesContainer.innerHTML = '<div class="schedule-widget__empty">No activities scheduled.</div>';
            }

            dayContainer.appendChild(activitiesContainer);
            contentArea.appendChild(dayContainer);
        });
    }

    updateNav() {
        // Update active class on existing nav tabs without re-rendering
        if (!this.dom.nav) return;

        const tabs = this.dom.nav.querySelectorAll('.schedule-widget__day-tab');
        tabs.forEach(tab => {
            if (tab.dataset.dayId === this.state.currentDayId) {
                tab.classList.add('schedule-widget__day-tab--active');
            } else {
                tab.classList.remove('schedule-widget__day-tab--active');
            }
        });
    }

    // ========================================
    // HANDLERS
    // ========================================

    handleDayChange(dayId) {
        this.state.currentDayId = dayId;
        this.updateNav();
        this.updateContent();
    }

    handleSearch(query) {
        this.state.searchQuery = query;
        this.updateContent();
    }

    handleActivityClick(activity) {
        console.log('Activity clicked:', activity);
        // Alert removed as requested. Future: Open Modal.
    }

    handleExport() {
        const { data } = this.state;
        console.log('Exporting ICS...');

        // Simple ICS Builder
        let icalContent =
            `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schedule Widget//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${data.eventInfo.title}
X-WR-TIMEZONE:${data.eventInfo.timezone || 'UTC'}
`;

        data.days.forEach(day => {
            day.activities.forEach(act => {
                // Construct DTSTART/DTEND
                // Needed format: YYYYMMDDTHHMMSS
                const dayStr = day.date.replace(/-/g, '');
                const startStr = act.startTime.replace(/:/g, '') + '00';
                const endStr = act.endTime ? act.endTime.replace(/:/g, '') + '00' : startStr; // fallback 0 duration

                icalContent += `BEGIN:VEVENT
UID:${act.id}@${window.location.host}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${dayStr}T${startStr}
DTEND:${dayStr}T${endStr}
SUMMARY:${act.title}
DESCRIPTION:${act.description || ''}
LOCATION:${act.location || ''}
END:VEVENT
`;
            });
        });

        icalContent += `END:VCALENDAR`;

        Utils.downloadICS(icalContent, `${data.eventInfo.title.replace(/\s+/g, '_')}.ics`);
    }

    // ========================================
    // HELPERS
    // ========================================

    filterActivities(activities) {
        if (!this.state.searchQuery) return activities;
        const q = this.state.searchQuery.toLowerCase();
        return activities.filter(a =>
            a.title.toLowerCase().includes(q) ||
            (a.description && a.description.toLowerCase().includes(q)) ||
            (a.location && a.location.toLowerCase().includes(q))
        );
    }
}

export default ScheduleWidget;
