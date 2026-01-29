# Schedule Widget - Integration Guide

## Quick Start (3 Steps)

### 1. Include the files

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <!-- Include base CSS -->
    <link rel="stylesheet" href="schedule-widget.css">
    
    <!-- Include your chosen theme -->
    <link rel="stylesheet" href="themes/mountain-retreat.css">
</head>
<body>
    <!-- Your container -->
    <div id="schedule-container"></div>
    
    <!-- Include utilities and widget JS -->
    <script src="utilities.js"></script>
    <script src="schedule-widget.js"></script>
</body>
</html>
```

### 2. Prepare your JSON data

Create a JSON file with your schedule data:

```json
{
  "eventInfo": {
    "title": "My Event 2025",
    "dateRange": "1-3 June 2025",
    "location": "Event Venue"
  },
  "days": [
    {
      "id": "day-1",
      "date": "2025-06-01",
      "dayLabel": "Day 1",
      "activities": [
        {
          "id": "activity-1",
          "startTime": "09:00",
          "endTime": "10:30",
          "title": "Opening Session",
          "type": "session",
          "icon": "📖"
        }
      ]
    }
  ]
}
```

### 3. Initialize the widget

```javascript
fetch('your-schedule.json')
    .then(response => response.json())
    .then(data => {
        ScheduleWidget.init({
            containerId: 'schedule-container',
            data: data,
            theme: 'mountain-retreat',
            displayMode: 'tabs'
        });
    });
```

---

## Available Themes

Choose one of the four built-in themes:

### 🏔️ Mountain Retreat
Perfect for: Camps, retreats, outdoor events
```html
<link rel="stylesheet" href="themes/mountain-retreat.css">
```
```javascript
theme: 'mountain-retreat'
```

### 💼 Professional Conference
Perfect for: Business conferences, tech events
```html
<link rel="stylesheet" href="themes/professional.css">
```
```javascript
theme: 'professional'
```

### ⛪ Community Church
Perfect for: Church events, spiritual retreats
```html
<link rel="stylesheet" href="themes/community-church.css">
```
```javascript
theme: 'community-church'
```

### 🎉 Festival Bright
Perfect for: Youth events, festivals
```html
<link rel="stylesheet" href="themes/festival-bright.css">
```
```javascript
theme: 'festival-bright'
```

---

## Display Modes

### 📑 Tabs Mode (Default)
Days are shown as tabs at the top
```javascript
displayMode: 'tabs'
```

### 📋 Accordion Mode
Days are expandable/collapsible sections
```javascript
displayMode: 'accordion'
```

### 📜 Full Scroll Mode
All days visible, scroll through the page
```javascript
displayMode: 'full-scroll'
```

### ⏱️ Timeline Mode
Visual timeline with connecting lines
```javascript
displayMode: 'timeline'
```

---

## Configuration Options

### Full Configuration Example

```javascript
ScheduleWidget.init({
    containerId: 'schedule-container',
    data: scheduleData,
    theme: 'mountain-retreat',
    displayMode: 'tabs',
    options: {
        showSearch: true,          // Enable search bar
        enableExport: true,        // Enable calendar export
        showIcons: true,           // Show activity icons
        language: 'ro',            // Language (ro/en)
        timeFormat: '24h',         // Time format (24h/12h)
        highlightCurrent: true,    // Highlight current activity
        showEndTimes: true,        // Show end times
        showSpeakers: true,        // Show speaker names
        showLocations: true        // Show locations
    },
    callbacks: {
        onActivityClick: (activity) => {
            console.log('Activity clicked:', activity);
        },
        onDayChange: (dayId) => {
            console.log('Day changed to:', dayId);
        }
    }
});
```

### Options Explained

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showSearch` | boolean | `false` | Show search/filter bar |
| `enableExport` | boolean | `false` | Enable calendar export (.ics) |
| `showIcons` | boolean | `true` | Display activity icons |
| `language` | string | `'ro'` | UI language (ro/en) |
| `timeFormat` | string | `'24h'` | Time display format (24h/12h) |
| `highlightCurrent` | boolean | `true` | Highlight current activity |
| `showEndTimes` | boolean | `true` | Display end times |
| `showSpeakers` | boolean | `true` | Show speaker information |
| `showLocations` | boolean | `true` | Display locations |

---

## JSON Data Schema

### Required Fields

```json
{
  "eventInfo": {
    "title": "REQUIRED - Event title",
    "dateRange": "REQUIRED - Date range"
  },
  "days": [
    {
      "id": "REQUIRED - Unique day ID",
      "date": "REQUIRED - ISO date (YYYY-MM-DD)",
      "dayLabel": "REQUIRED - Display label",
      "activities": [
        {
          "id": "REQUIRED - Unique activity ID",
          "startTime": "REQUIRED - HH:MM format",
          "title": "REQUIRED - Activity title",
          "type": "REQUIRED - Activity type"
        }
      ]
    }
  ]
}
```

### Optional Fields

```json
{
  "eventInfo": {
    "subtitle": "Optional tagline",
    "location": "Optional event location",
    "timezone": "Optional timezone (default: Europe/Bucharest)"
  },
  "days": [
    {
      "theme": "Optional day theme/title",
      "activities": [
        {
          "endTime": "HH:MM",
          "description": "Detailed description",
          "location": "Specific room/venue",
          "icon": "Emoji or icon",
          "speakers": [
            {
              "name": "Speaker name",
              "role": "Speaker role"
            }
          ],
          "isOptional": true,
          "tags": ["tag1", "tag2"],
          "color": "#custom-color"
        }
      ]
    }
  ],
  "activityTypes": {
    "custom-type": {
      "color": "#hex-color",
      "icon": "emoji",
      "label": "Display label"
    }
  }
}
```

### Activity Types

Built-in activity types with default styling:

- `logistics` - 📋 Logistică (arrival, departure)
- `session` - 📖 Sesiune (talks, workshops)
- `meal` - 🍽️ Masă (breakfast, lunch, dinner)
- `break` - ☕ Pauză (coffee breaks, rest)
- `worship` - 🙏 Închinare (worship, prayer)
- `recreation` - ⚽ Recreere (games, activities)
- `meeting` - 👥 Întâlnire (group meetings)
- `other` - 📌 Altele (miscellaneous)

---

## API Methods

### Initialize
```javascript
const widget = ScheduleWidget.init(config);
```

### Update Data
```javascript
widget.update(newData);
```

### Change Theme
```javascript
widget.setTheme('professional');
```

### Change Display Mode
```javascript
widget.setDisplayMode('accordion');
```

### Get State
```javascript
const state = widget.getState();
// Returns: { theme, displayMode, currentDay }
```

### Destroy
```javascript
widget.destroy();
```

---

## Customization

### Override CSS Variables

```css
:root {
    --sw-color-primary: #your-color;
    --sw-color-secondary: #your-color;
    --sw-color-accent: #your-color;
    --sw-font-family-base: 'Your Font', sans-serif;
}
```

### Custom Styling

All widget elements use the `schedule-widget__` prefix:

```css
.schedule-widget__activity-card {
    /* Your custom styles */
}

.schedule-widget__day-tab--active {
    /* Custom active tab style */
}
```

---

## Examples

### Example 1: Simple Camp Schedule

```html
<link rel="stylesheet" href="schedule-widget.css">
<link rel="stylesheet" href="themes/mountain-retreat.css">

<div id="schedule"></div>

<script src="utilities.js"></script>
<script src="schedule-widget.js"></script>
<script>
    fetch('camp-schedule.json')
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
```

### Example 2: Conference with Search

```html
<link rel="stylesheet" href="schedule-widget.css">
<link rel="stylesheet" href="themes/professional.css">

<div id="schedule"></div>

<script src="utilities.js"></script>
<script src="schedule-widget.js"></script>
<script>
    ScheduleWidget.init({
        containerId: 'schedule',
        data: conferenceData,
        theme: 'professional',
        displayMode: 'accordion',
        options: {
            showSearch: true,
            enableExport: true,
            showSpeakers: true
        }
    });
</script>
```

### Example 3: Church Event Timeline

```html
<link rel="stylesheet" href="schedule-widget.css">
<link rel="stylesheet" href="themes/community-church.css">

<div id="schedule"></div>

<script src="utilities.js"></script>
<script src="schedule-widget.js"></script>
<script>
    ScheduleWidget.init({
        containerId: 'schedule',
        data: churchEventData,
        theme: 'community-church',
        displayMode: 'timeline',
        options: {
            highlightCurrent: true,
            timeFormat: '12h'
        }
    });
</script>
```

---

## Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ⚠️ IE11 (limited support)

---

## Performance

- Bundle size: < 50KB (unminified)
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Mobile optimized: 60fps animations

---

## Accessibility

The widget is WCAG 2.1 AA compliant:

- ✅ Full keyboard navigation
- ✅ Screen reader friendly
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Sufficient color contrast
- ✅ Reduced motion support

### Keyboard Navigation

- `Tab` - Navigate between elements
- `Enter/Space` - Activate buttons and cards
- `Arrow keys` - Navigate tabs
- `Escape` - Close modal

---

## Troubleshooting

### Widget doesn't load

1. Check console for errors
2. Verify all files are included correctly
3. Ensure JSON data is valid
4. Check container element exists

### Styles look broken

1. Verify CSS files are loaded
2. Check for CSS conflicts
3. Ensure theme file is included
4. Try adding `!important` to custom styles

### Data not displaying

1. Validate JSON against schema
2. Check required fields are present
3. Verify time format is HH:MM
4. Check date format is YYYY-MM-DD

---

## Support

For issues and questions:
- GitHub Issues: [repository-url]
- Documentation: See `README.md`
- Examples: See `demo.html`

---

## License

MIT License - Free to use in personal and commercial projects.

---

**Version:** 1.0.0  
**Last Updated:** January 2026
