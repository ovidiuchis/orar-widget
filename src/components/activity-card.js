/**
 * Activity Card Component
 */
import Utils from '../utilities.js';

export const ActivityCard = (activity, activityTypes, options, handlers) => {
    const typeDef = activityTypes[activity.type] || activityTypes.other || { color: '#ccc', icon: '📌' };

    const card = document.createElement('div');
    card.className = 'schedule-widget__activity-card';
    card.dataset.id = activity.id;
    card.dataset.type = activity.type;

    // Set custom property for the color bar
    card.style.setProperty('--activity-color', typeDef.color);

    // Time Column
    const timeCol = document.createElement('div');
    timeCol.className = 'schedule-widget__activity-time';

    const startTime = document.createElement('span');
    startTime.className = 'schedule-widget__time-start';
    startTime.textContent = Utils.formatTime(activity.startTime, options.timeFormat);
    timeCol.appendChild(startTime);

    if (options.showEndTimes && activity.endTime) {
        const endTime = document.createElement('span');
        endTime.className = 'schedule-widget__time-end';
        endTime.style.fontSize = '0.85em';
        endTime.style.opacity = '0.8';
        endTime.textContent = Utils.formatTime(activity.endTime, options.timeFormat);
        timeCol.appendChild(endTime);
    }

    card.appendChild(timeCol);

    // Content Column
    const contentCol = document.createElement('div');
    contentCol.className = 'schedule-widget__activity-content';

    // Header: Icon + Title
    const header = document.createElement('div');
    header.className = 'schedule-widget__activity-header';
    header.style.display = 'flex';
    header.style.alignItems = 'flex-start'; // Align top
    header.style.gap = 'var(--spacing-sm)';

    if (options.showIcons) {
        const icon = document.createElement('span');
        icon.className = 'schedule-widget__activity-icon';
        icon.textContent = activity.icon || typeDef.icon || '';
        icon.ariaHidden = 'true';
        header.appendChild(icon);
    }

    const title = document.createElement('h3');
    title.className = 'schedule-widget__activity-title';
    title.textContent = activity.title;
    header.appendChild(title);

    if (activity.isOptional) {
        const badge = document.createElement('span');
        badge.className = 'schedule-widget__badge';
        badge.textContent = 'Optional';
        badge.style.fontSize = 'var(--font-size-xs)';
        badge.style.background = '#eee';
        badge.style.padding = '2px 6px';
        badge.style.borderRadius = 'var(--radius-pill)';
        badge.style.alignSelf = 'center';
        header.appendChild(badge);
    }

    contentCol.appendChild(header);

    // Speakers
    if (options.showSpeakers && activity.speakers && activity.speakers.length > 0) {
        const speakers = document.createElement('div');
        speakers.className = 'schedule-widget__activity-speakers';
        speakers.style.fontSize = 'var(--font-size-sm)';
        speakers.style.color = 'var(--text-secondary)';
        speakers.innerHTML = `🎤 ${activity.speakers.map(s => Utils.sanitizeHTML(s.name)).join(', ')}`;
        contentCol.appendChild(speakers);
    }

    // Location
    if (options.showLocations && activity.location) {
        const loc = document.createElement('div');
        loc.className = 'schedule-widget__activity-location';
        loc.style.fontSize = 'var(--font-size-sm)';
        loc.style.color = 'var(--text-muted)';
        loc.innerHTML = `📍 ${Utils.sanitizeHTML(activity.location)}`;
        contentCol.appendChild(loc);
    }

    // Description (short)
    if (activity.description) {
        const desc = document.createElement('p');
        desc.className = 'schedule-widget__activity-description';
        desc.textContent = activity.description;
        contentCol.append(desc);
    }

    card.appendChild(contentCol);

    // Click handler
    card.addEventListener('click', () => {
        if (handlers.onClick) handlers.onClick(activity);
    });

    return card;
};
