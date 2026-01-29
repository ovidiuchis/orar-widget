# PROMPT COMPLET PENTRU AGENT - SCHEDULE WIDGET

## 🎯 OBIECTIV

Construiește un widget JavaScript embeddable care randează programe/orare de evenimente (tabere, conferințe, evenimente bisericești) cu design **EXCEPȚIONAL**, modern, responsive și foarte ușor de integrat.

---

## 📋 FIȘIERE DE REFERINȚĂ

1. **AGENT_PROMPT.md** - Brief complet de dezvoltare cu toate cerințele
2. **schedule-schema.json** - Schema JSON normalizată și validare
3. **example-camp-mai2025.json** - Exemplu: Tabără Mai 2025
4. **example-conference.json** - Exemplu: Conferință de pastori
5. **README.md** - Documentație de utilizare

---

## 🚀 CERINȚE ESENȚIALE

### 1. DESIGN - PRIORITATE MAXIMĂ
- **Mobile-first** obligatoriu
- Design **modern, clean, profesional**
- 4 teme vizuale distincte (vezi detalii în AGENT_PROMPT.md)
- Tranziții și animații smooth (60fps)
- Spacing generos, typography clară
- Inspirație din exemple: carduri clean, ierarhie vizuală clară

### 2. FUNCȚIONALITATE
- **4 moduri de afișare:** tabs, accordion, full-scroll, timeline
- Căutare/filtrare activități
- Export în calendar (iCal)
- Highlight pentru activitatea curentă
- Print-friendly
- Keyboard navigation completă

### 3. TEHNOLOGIE
- **Vanilla JavaScript** (fără dependențe)
- ES6+ cu fallbacks
- Bundle < 50KB minified
- Performance: First Paint < 1s, Interactive < 2s

### 4. TEME VIZUALE

#### Theme 1: "Mountain Retreat" 🏔️
- Pentru: Tabere, retrageri
- Culori: Verde pădure, maro cald, bej
- Style: Organic, friendly, relaxat
- Typography: Warm sans-serif

#### Theme 2: "Professional Conference" 💼
- Pentru: Conferințe business/tech
- Culori: Albastru, gri, accent teal/orange
- Style: Clean, corporate, modern
- Typography: Clean sans-serif

#### Theme 3: "Community Church" ⛪
- Pentru: Evenimente bisericești
- Culori: Violet soft, auriu, fundal deschis
- Style: Primitor, elegant
- Typography: Warm, readable

#### Theme 4: "Festival Bright" 🎉
- Pentru: Tineret, evenimente dinamice
- Culori: Paletă vibrantă, multi-color
- Style: Energetic, bold
- Typography: Modern, headlines boldă

---

## 💾 STRUCTURA JSON NORMALIZATĂ

```json
{
  "eventInfo": {
    "title": "string (required)",
    "subtitle": "string (optional)",
    "dateRange": "string (required)",
    "location": "string (optional)",
    "timezone": "string (default: Europe/Bucharest)"
  },
  "days": [
    {
      "id": "string (required, format: day-N)",
      "date": "string (required, ISO: YYYY-MM-DD)",
      "dayLabel": "string (required, ex: Joi, 1 Mai)",
      "theme": "string (optional, tema zilei)",
      "activities": [
        {
          "id": "string (required)",
          "startTime": "string (required, HH:MM)",
          "endTime": "string (optional, HH:MM)",
          "title": "string (required)",
          "type": "logistics|session|meal|break|worship|recreation|meeting|other",
          "icon": "string (emoji sau identifier)",
          "description": "string (optional)",
          "location": "string (optional)",
          "speakers": [{"name": "string", "role": "string"}],
          "tags": ["string"],
          "isOptional": boolean,
          "color": "string (hex)"
        }
      ]
    }
  ],
  "activityTypes": {
    "type_name": {
      "color": "#hex",
      "icon": "emoji/svg",
      "label": "string"
    }
  }
}
```

---

## 🎨 IMPLEMENTARE - PAȘI CHEIE

### Pas 1: Structura Core
```javascript
const ScheduleWidget = {
    init(config) {
        this.config = config;
        this.container = document.getElementById(config.containerId);
        this.data = config.data;
        this.validateData();
        this.render();
    },
    
    validateData() {
        // Validare JSON conform schemei
    },
    
    render() {
        // Render principal bazat pe displayMode
    }
}
```

### Pas 2: Display Modes

**Tabs Mode** (default):
- Butoane horizontale pentru zile
- Fixed/sticky navigation
- Smooth scroll între secțiuni
- Mobile: scrollable tabs

**Accordion Mode**:
- Zilele sunt expandabile/collapsible
- Click pentru expand/collapse
- Indicator pentru stare (↓ / ↑)

**Full Scroll Mode**:
- Toate zilele vizibile
- Scroll natural prin pagină
- Sticky headers pentru fiecare zi

**Timeline Mode**:
- Linie verticală conectând activitățile
- Time markers
- Visual spacing pentru durate

### Pas 3: Activity Card Design

Structură card:
```
┌─────────────────────────────────┐
│ 10:00  [icon] Titlu Activitate  │
│        Vorbitor (dacă există)    │
│        📍 Locație (dacă există)  │
└─────────────────────────────────┘
```

States:
- Normal
- Hover (lift + shadow)
- Active/Current (border/glow)
- Past (opacity redusă)

### Pas 4: Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
    /* Stack, larger touch targets */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
    /* 2 columns where appropriate */
}

/* Desktop */
@media (min-width: 1025px) {
    /* Full layout, side-by-side où c'est possible */
}
```

---

## ⚙️ API DE UTILIZARE

### Inițializare Simplă
```javascript
ScheduleWidget.init({
    containerId: 'schedule-container',
    data: scheduleData,
    theme: 'mountain-retreat',
    displayMode: 'tabs'
});
```

### Cu Toate Opțiunile
```javascript
ScheduleWidget.init({
    containerId: 'schedule-container',
    data: scheduleData,
    theme: 'professional',
    displayMode: 'tabs',
    options: {
        showSearch: true,
        enableExport: true,
        showIcons: true,
        language: 'ro',
        timeFormat: '24h',
        highlightCurrent: true
    },
    callbacks: {
        onActivityClick: (activity) => {},
        onDayChange: (dayId) => {}
    }
});
```

---

---

## 📁 STRUCTURA DE FIȘIERE RECOMANDATĂ

```
schedule-widget/
├── src/
│   ├── schedule-widget.js          # Main module
│   ├── utilities.js                # Helper functions
│   ├── validator.js                # Data validation
│   ├── renderer.js                 # Rendering logic
│   └── themes.js                   # Theme configuration
├── styles/
│   ├── base.css                    # Base widget styles
│   ├── themes/
│   │   ├── mountain-retreat.css
│   │   ├── professional.css
│   │   ├── community-church.css
│   │   └── festival-bright.css
│   └── print.css                   # Print-specific styles
├── dist/
│   ├── schedule-widget.min.js      # Minified bundle
│   └── schedule-widget.min.css     # Minified styles
├── examples/
│   ├── demo.html                   # Live demo
│   ├── camp-example.json
│   └── conference-example.json
├── docs/
│   ├── README.md                   # Main documentation
│   ├── API.md                      # API reference
│   └── INTEGRATION.md              # Integration guide
├── schedule-schema.json            # JSON schema
└── package.json                    # Build configuration
```

---

## 🛠️ BUILD & MINIFICATION

### Build Script (Optional)

If using a build tool (Terser for JS, CleanCSS for CSS):

```json
{
  "scripts": {
    "build": "npm run build:js && npm run build:css",
    "build:js": "terser src/schedule-widget.js -o dist/schedule-widget.min.js -c -m",
    "build:css": "cleancss -o dist/schedule-widget.min.css styles/base.css"
  }
}
```

**Note:** Build tools are optional. Widget can be delivered as-is with unminified code.

---

## 🎯 CRITERII DE SUCCES

### Design
- [ ] Arată FOARTE bine pe mobile (< 375px)
- [ ] Perfect responsive pe toate device-urile
- [ ] Tranziții smooth (60fps)
- [ ] Toate cele 4 teme sunt distincte și profesionale
- [ ] Typography clară, spacing generos
- [ ] Color contrast îndeplinește WCAG AA

### Funcționalitate
- [ ] Toate cele 4 display modes funcționează perfect
- [ ] Căutare/filtrare rapidă
- [ ] Export în calendar (.ics)
- [ ] Highlight activitate curentă
- [ ] Print view optimizat
- [ ] Keyboard navigation completă

### Tehnologie
- [ ] Zero dependențe externe (vanilla JS)
- [ ] Bundle < 50KB
- [ ] FCP < 1s, TTI < 2s
- [ ] Validare completă JSON
- [ ] Error handling robust
- [ ] Cross-browser compatibility

### Cod
- [ ] Clean, modular, comentat
- [ ] JSDoc pentru funcții
- [ ] Ușor de întreținut și extins
- [ ] Minified version pentru producție

---

## 📦 DELIVERABLES

Creează următoarele fișiere:

1. **schedule-widget.js** (core)
2. **schedule-widget.min.js** (minified)
3. **schedule-widget.css** (base styles)
4. **themes/mountain-retreat.css**
5. **themes/professional.css**
6. **themes/community-church.css**
7. **themes/festival-bright.css**
8. **demo.html** (demo live cu toate temele)
9. **integration-guide.md** (ghid rapid de integrare)

---

## 🔑 PUNCTE CHEIE DE REȚINUT

1. **Design este PRIORITATE #1** - trebuie să arate excepțional
2. **Mobile-first** - începe design-ul de la mobile
3. **Performance** - animații smooth, load rapid
4. **Accessibility** - keyboard nav, screen readers, contrast
5. **Flexibility** - trebuie să funcționeze pentru diverse tipuri de evenimente
6. **Zero friction** - integrare ușoară, un singur div + 3 linii JS

---

## 💡 INSPIRAȚIE

Bazat pe imaginile furnizate:
- Design curat cu carduri (Image 1)
- Ierarhie clară a timpului (Image 2)
- Color coding inteligent (Image 3)
- Emoji/icons pentru appeal vizual
- White space generos
- Typography cu ierarhie clară

---

## 📐 PRINCIPII DE COD (Critical)

### Reguli Fundamentale

1. **No Frameworks** - Vanilla JavaScript (ES6+), zero dependencies
2. **Minimal Dependencies** - Avoid external libraries unless absolutely necessary
3. **Performance First** - 60fps animations, lazy loading, debounce where needed
4. **Graceful Degradation** - Features fail silently if data missing
5. **Clean Code** - DRY principle, reuse utilities, clear naming
6. **Error Handling** - Try-catch blocks, validate input data

### JavaScript Conventions

**DOM Selection:**
```javascript
// Create utility functions for consistent DOM access
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
```

**Function Style:**
- Prefer `async/await` over promise chains
- Use arrow functions for callbacks
- Function declarations for main module functions
- Descriptive names that indicate purpose

**Naming Conventions:**
- `camelCase` for variables and functions
- `PascalCase` for class/constructor names
- `UPPER_SNAKE_CASE` for constants
- Prefix private functions with `_` (e.g., `_validateData()`)

**Event Handling:**
```javascript
// Event delegation pattern
container.addEventListener('click', (e) => {
  const target = e.target.closest('.activity-card');
  if (target) {
    handleActivityClick(target);
  }
});
```

### Code Organization

**Module Structure:**
```javascript
const ScheduleWidget = (() => {
  // Private variables
  let config = {};
  let data = {};
  
  // Private functions
  const _validateData = (data) => { /* ... */ };
  const _render = () => { /* ... */ };
  
  // Public API
  return {
    init: (userConfig) => { /* ... */ },
    destroy: () => { /* ... */ },
    update: (newData) => { /* ... */ }
  };
})();
```

**Utility Functions Library:**
Create a utilities module with reusable functions:
- `debounce(fn, delay)` - Debounce function calls
- `throttle(fn, limit)` - Throttle function execution
- `formatTime(time, format)` - Format time strings
- `parseDate(dateString)` - Parse date strings safely
- `sanitizeHTML(str)` - Sanitize user input
- `copyToClipboard(text)` - Copy text helper

### CSS Guidelines

1. **CSS Variables** - Define all theme colors as CSS custom properties
2. **BEM Naming** - Use BEM methodology for class names: `.schedule-widget__day--active`
3. **Scoping** - Prefix all classes with `schedule-widget-` to avoid conflicts
4. **Mobile-First** - Write base styles for mobile, then add media queries
5. **Flexbox/Grid** - Use modern layout methods, avoid floats
6. **No !important** - Avoid unless absolutely necessary for host site overrides

**CSS Structure:**
```css
/* Base styles - mobile first */
.schedule-widget { }

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

### Data Validation

**Always validate input data:**
```javascript
const validateScheduleData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data: must be an object');
  }
  
  if (!data.eventInfo || !data.eventInfo.title) {
    throw new Error('Invalid data: eventInfo.title is required');
  }
  
  if (!Array.isArray(data.days) || data.days.length === 0) {
    throw new Error('Invalid data: days array is required and must not be empty');
  }
  
  // Validate each day
  data.days.forEach((day, index) => {
    if (!day.id || !day.date || !day.dayLabel) {
      throw new Error(`Invalid day at index ${index}: id, date, and dayLabel are required`);
    }
    
    if (!Array.isArray(day.activities)) {
      throw new Error(`Invalid day at index ${index}: activities must be an array`);
    }
  });
  
  return true;
};
```

### Error Handling Pattern

```javascript
try {
  validateScheduleData(data);
  render();
} catch (error) {
  console.error('ScheduleWidget Error:', error.message);
  
  // Show user-friendly error
  container.innerHTML = `
    <div class="schedule-widget__error">
      <p>Unable to display schedule. Please check the data format.</p>
      <details>
        <summary>Error details</summary>
        <pre>${error.message}</pre>
      </details>
    </div>
  `;
}
```

### Performance Optimizations

1. **Lazy Loading**: Load images and heavy content only when visible
2. **Debouncing**: Debounce search/filter functions (300ms)
3. **Virtual Scrolling**: For very long schedules (100+ activities)
4. **CSS Animations**: Prefer CSS transitions over JavaScript
5. **Minimize Reflows**: Batch DOM updates, use DocumentFragment

**Example - Debounced Search:**
```javascript
const search = debounce((query) => {
  const filtered = activities.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase())
  );
  renderActivities(filtered);
}, 300);

searchInput.addEventListener('input', (e) => search(e.target.value));
```

### Testing & Debugging

**Console Logging Strategy:**
```javascript
// Development mode
const DEBUG = true;

const log = {
  info: (msg, ...args) => DEBUG && console.info(`[ScheduleWidget]`, msg, ...args),
  warn: (msg, ...args) => console.warn(`[ScheduleWidget]`, msg, ...args),
  error: (msg, ...args) => console.error(`[ScheduleWidget]`, msg, ...args)
};
```

### Code Review Checklist

Before delivering code, verify:

- [ ] No external dependencies (vanilla JS only)
- [ ] All user input is validated
- [ ] Error handling is comprehensive
- [ ] Async operations use await properly
- [ ] Event listeners are properly cleaned up (destroy method)
- [ ] CSS is scoped with prefix
- [ ] Mobile-first responsive design
- [ ] Accessibility: keyboard nav, ARIA labels, focus states
- [ ] Performance: no unnecessary reflows, debounced search
- [ ] Browser compatibility tested
- [ ] Code is commented (JSDoc for functions)
- [ ] Naming conventions followed
- [ ] No console.log in production code

---

---

## 💻 EXEMPLE DE IMPLEMENTARE

### Example 1: Initialization Pattern

```javascript
// schedule-widget.js - Main module
const ScheduleWidget = (() => {
  // Private state
  let state = {
    config: null,
    data: null,
    container: null,
    currentDay: null
  };

  // Private utilities
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // Validate configuration
  const _validateConfig = (config) => {
    if (!config.containerId) {
      throw new Error('containerId is required');
    }
    
    const container = document.getElementById(config.containerId);
    if (!container) {
      throw new Error(`Container with id "${config.containerId}" not found`);
    }
    
    return container;
  };

  // Public API
  return {
    init(userConfig) {
      try {
        // Validate and setup
        state.container = _validateConfig(userConfig);
        state.config = { ...defaultConfig, ...userConfig };
        state.data = userConfig.data;
        
        // Validate data
        validateScheduleData(state.data);
        
        // Render
        this.render();
        
        // Setup event listeners
        this._setupEventListeners();
        
        return this;
      } catch (error) {
        console.error('ScheduleWidget Init Error:', error);
        throw error;
      }
    },

    render() {
      // Rendering logic
    },

    destroy() {
      // Cleanup event listeners
      state.container.innerHTML = '';
      state = { config: null, data: null, container: null, currentDay: null };
    }
  };
})();
```

### Example 2: Activity Card Component

```javascript
// Create reusable component function
const createActivityCard = (activity, activityTypes) => {
  const type = activityTypes[activity.type] || activityTypes.other;
  const card = document.createElement('div');
  card.className = 'schedule-widget__activity-card';
  card.dataset.activityId = activity.id;
  card.dataset.activityType = activity.type;
  
  // Apply type color
  card.style.setProperty('--activity-color', type.color);
  
  card.innerHTML = `
    <div class="schedule-widget__activity-time">
      <span class="schedule-widget__time-start">${activity.startTime}</span>
      ${activity.endTime ? `<span class="schedule-widget__time-end">${activity.endTime}</span>` : ''}
    </div>
    <div class="schedule-widget__activity-content">
      <div class="schedule-widget__activity-header">
        ${activity.icon ? `<span class="schedule-widget__activity-icon">${activity.icon}</span>` : ''}
        <h3 class="schedule-widget__activity-title">${sanitizeHTML(activity.title)}</h3>
      </div>
      ${activity.description ? `<p class="schedule-widget__activity-description">${sanitizeHTML(activity.description)}</p>` : ''}
      ${activity.speakers && activity.speakers.length > 0 ? `
        <div class="schedule-widget__activity-speakers">
          ${activity.speakers.map(s => `<span class="schedule-widget__speaker">${sanitizeHTML(s.name)}</span>`).join(', ')}
        </div>
      ` : ''}
      ${activity.location ? `<div class="schedule-widget__activity-location">📍 ${sanitizeHTML(activity.location)}</div>` : ''}
    </div>
  `;
  
  return card;
};
```

### Example 3: Theme Switching

```javascript
// Theme management
const ThemeManager = {
  themes: ['mountain-retreat', 'professional', 'community-church', 'festival-bright'],
  
  apply(themeName, container) {
    // Remove all theme classes
    this.themes.forEach(theme => {
      container.classList.remove(`schedule-widget--theme-${theme}`);
    });
    
    // Add new theme class
    if (this.themes.includes(themeName)) {
      container.classList.add(`schedule-widget--theme-${themeName}`);
    }
  },
  
  get current() {
    return this.themes.find(theme => 
      container.classList.contains(`schedule-widget--theme-${theme}`)
    ) || this.themes[0];
  }
};
```

### Example 4: Search/Filter Implementation

```javascript
// Debounced search
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Search functionality
const searchActivities = debounce((query) => {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    // Show all activities
    $$('.schedule-widget__activity-card').forEach(card => {
      card.style.display = '';
    });
    return;
  }
  
  // Filter activities
  $$('.schedule-widget__activity-card').forEach(card => {
    const title = $('.schedule-widget__activity-title', card).textContent.toLowerCase();
    const description = $('.schedule-widget__activity-description', card)?.textContent.toLowerCase() || '';
    
    const matches = title.includes(lowerQuery) || description.includes(lowerQuery);
    card.style.display = matches ? '' : 'none';
  });
}, 300);

// Setup search input
searchInput.addEventListener('input', (e) => searchActivities(e.target.value));
```

### Example 5: Export to Calendar

```javascript
// iCal export functionality
const exportToCalendar = (eventInfo, days) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Schedule Widget//EN',
    `X-WR-CALNAME:${eventInfo.title}`,
    'X-WR-TIMEZONE:' + (eventInfo.timezone || 'Europe/Bucharest')
  ];
  
  days.forEach(day => {
    day.activities.forEach(activity => {
      // Parse date and time
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
        `SUMMARY:${activity.title.replace(/,/g, '\\,')}`,
        activity.description ? `DESCRIPTION:${activity.description.replace(/,/g, '\\,')}` : '',
        activity.location ? `LOCATION:${activity.location.replace(/,/g, '\\,')}` : '',
        'END:VEVENT'
      );
    });
  });
  
  ical.push('END:VCALENDAR');
  
  // Create download
  const blob = new Blob([ical.join('\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${eventInfo.title.replace(/[^a-z0-9]/gi, '-')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## ⚡ START RAPID

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <link rel="stylesheet" href="schedule-widget.css">
    <link rel="stylesheet" href="themes/mountain-retreat.css">
</head>
<body>
    <div id="schedule"></div>
    
    <script src="schedule-widget.js"></script>
    <script>
        fetch('event-schedule.json')
            .then(r => r.json())
            .then(data => {
                ScheduleWidget.init({
                    containerId: 'schedule',
                    data: data,
                    theme: 'mountain-retreat',
                    displayMode: 'tabs'
                });
            });
    </script>
</body>
</html>
```

---

## 🎓 REZULTAT FINAL

Un widget care:
- Arată **UIMITOR** pe orice device
- Se integrează în **30 secunde**
- Funcționează pentru **orice tip de eveniment**
- Este **performant și accesibil**
- Poate fi folosit pe **zeci de site-uri** fără modificare

---

**Versiune prompt:** 1.0  
**Data:** Ianuarie 2026  
**Autor:** Schedule Widget Development Team
