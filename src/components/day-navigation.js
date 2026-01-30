/**
 * Day Navigation Component
 */
import Utils from '../utilities.js';

export const DayNavigation = (days, currentDayId, handlers) => {
    const nav = document.createElement('div');
    nav.className = 'schedule-widget__day-nav';
    nav.style.display = 'flex';
    nav.style.overflowX = 'auto';
    nav.style.gap = 'var(--spacing-sm)';
    nav.style.paddingBottom = 'var(--spacing-md)';
    nav.style.marginBottom = 'var(--spacing-md)';
    nav.style.borderBottom = '1px solid #eee';
    // Hide scrollbar but allow scroll
    nav.style.scrollbarWidth = 'none'; // Firefox
    nav.style.msOverflowStyle = 'none';  // IE 10+

    days.forEach(day => {
        const btn = document.createElement('button');
        btn.className = 'schedule-widget__day-tab';
        btn.dataset.dayId = day.id; // Correctly set data attribute for updateNav
        if (day.id === currentDayId) {
            btn.classList.add('schedule-widget__day-tab--active');
        }

        // Style handled by CSS mostly, but setting base here
        btn.textContent = day.dayLabel;

        // Add date underneath
        if (day.date) {
            const dateSpan = document.createElement('span');
            dateSpan.style.display = 'block';
            dateSpan.style.fontSize = '0.8em';
            dateSpan.style.opacity = '0.8';
            dateSpan.style.marginTop = '2px';
            const d = Utils.parseDate(day.date);
            // Short Format: 1 May
            dateSpan.textContent = Utils.formatDate(d, 'ro-RO', { day: 'numeric', month: 'short' });
            btn.appendChild(dateSpan);
        }

        btn.addEventListener('click', () => {
            if (handlers.onDayChange) handlers.onDayChange(day.id);
        });

        nav.appendChild(btn);
    });

    return nav;
};
