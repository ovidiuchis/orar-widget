/**
 * Header Component
 */
import Utils from '../utilities.js';

export const Header = (eventInfo, config, handlers) => {
  const header = document.createElement('div');
  header.className = 'schedule-widget__header';

  // Handle URLs - support both array and single URL for backward compatibility
  let urlsHTML = '';
  if (eventInfo.urls && Array.isArray(eventInfo.urls)) {
    // New format: array of {url, title}
    urlsHTML = eventInfo.urls.map(link =>
      `<span class="schedule-widget__url"><a href="${Utils.sanitizeHTML(link.url)}" target="_blank" rel="noopener noreferrer">🔗 ${Utils.sanitizeHTML(link.title)}</a></span>`
    ).join('');
  } else if (eventInfo.url) {
    // Legacy format: single URL string
    urlsHTML = `<span class="schedule-widget__url"><a href="${Utils.sanitizeHTML(eventInfo.url)}" target="_blank" rel="noopener noreferrer">🔗 Venue Website</a></span>`;
  }

  header.innerHTML = `
    <div class="schedule-widget__header-content">
      <h1 class="schedule-widget__title">${Utils.sanitizeHTML(eventInfo.title)}</h1>
      ${eventInfo.subtitle ? `<p class="schedule-widget__subtitle">${Utils.sanitizeHTML(eventInfo.subtitle)}</p>` : ''}
      <div class="schedule-widget__meta">
        <span class="schedule-widget__date-range">📅 ${Utils.sanitizeHTML(eventInfo.dateRange)}</span>
        ${eventInfo.location ? `<span class="schedule-widget__location">📍 ${Utils.sanitizeHTML(eventInfo.location)}</span>` : ''}
        ${urlsHTML}
      </div>
    </div>
  `;

  // Controls Container
  if (config.options.showSearch || config.options.showThemeToggle) {
    const controls = document.createElement('div');
    controls.className = 'schedule-widget__header-controls';
    controls.style.marginTop = 'var(--spacing-md)';
    controls.style.display = 'flex';
    controls.style.gap = 'var(--spacing-md)';
    controls.style.flexWrap = 'wrap';

    // Search
    if (config.options.showSearch) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'schedule-widget__search-container';

      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.className = 'schedule-widget__search-input';
      searchInput.placeholder = 'Search...';
      searchInput.style.padding = 'var(--spacing-sm)';
      searchInput.style.borderRadius = 'var(--radius-sm)';
      searchInput.style.border = '1px solid #ccc';

      searchInput.addEventListener('input', (e) => {
        if (handlers.onSearch) handlers.onSearch(e.target.value);
      });

      searchContainer.appendChild(searchInput);
      controls.appendChild(searchContainer);
    }

    // Export feature removed

    header.appendChild(controls);
  }

  return header;
};
