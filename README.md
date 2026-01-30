# Orar Widget - Documentație de Utilizare

## Prezentare Generală

Acest widget JavaScript permite randarea frumoasă și responsivă a orarelor pentru evenimente de diferite tipuri: conferințe, tabere, evenimente bisericești, etc.

## Caracteristici Principale

✅ **Design modern și clean** - 4 teme vizuale predefinite  
✅ **Mobile-first & Responsive** - Perfect pe orice dispozitiv  
✅ **Flexibil** - Multiple moduri de afișare  
✅ **Ușor de integrat** - Simplu embed în orice site  
✅ **Customizabil** - JSON simplu pentru orice tip de eveniment  
✅ **Accessible** - Urmează standardele WCAG 2.1  

## Quick Start (CDN / GitHub Pages)

You can use the widget directly in your project without downloading files by importing from GitHub Pages or a CDN.

### Method 1: All-in-One (Simplest)

```html
<!-- Single CSS file with everything -->
<link rel="stylesheet" href="https://ovidiuchis.github.io/orar-widget/styles/schedule-widget-all.css">

<div id="schedule"></div>

<script type="module">
import ScheduleWidget from 'https://ovidiuchis.github.io/orar-widget/src/schedule-widget.js';

fetch('your-data.json')
    .then(r => r.json())
    .then(data => {
        new ScheduleWidget({
            containerId: 'schedule',
            data: data,
            theme: 'outdoor'  // Choose: outdoor, brighty, conference, community
        });
    });
</script>
```

### Method 2: Modular (Smaller file size)

```html
<!-- Base Styles -->
<link rel="stylesheet" href="https://ovidiuchis.github.io/orar-widget/styles/base.css">
<link rel="stylesheet" href="https://ovidiuchis.github.io/orar-widget/styles/layout.css">

<!-- Theme (Choose one) -->
<link rel="stylesheet" href="https://ovidiuchis.github.io/orar-widget/styles/themes/outdoor.css">
```

```javascript
import ScheduleWidget from 'https://ovidiuchis.github.io/orar-widget/src/schedule-widget.js';
// OR via jsDelivr
// import ScheduleWidget from 'https://cdn.jsdelivr.net/gh/ovidiuchis/orar-widget@main/src/schedule-widget.js';

fetch('your-data.json')
    .then(r => r.json())
    .then(data => {
        new ScheduleWidget({
            containerId: 'schedule',
            data: data,
            theme: 'outdoor'
        });
    });
```

## Installation (Local)

### 1. Clone or Download
Clone this repository to get the files locally.

### 2. Include files in HTML

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>Event Schedule</title>
    
    <!-- Local CSS -->
    <link rel="stylesheet" href="./styles/layout.css">
    <link rel="stylesheet" href="./styles/themes/outdoor.css">
</head>
<body>
    <div id="schedule-container"></div>
    
    <script type="module">
        import ScheduleWidget from './src/schedule-widget.js';
        
        // ... initialization code
    </script>
</body>
</html>
```

### 3. Prepare Data JSON


Creează un fișier JSON (ex: `tabara2025.json`) cu structura:

```json
{
  "eventInfo": {
    "title": "Numele Evenimentului",
    "dateRange": "1-4 Mai 2025",
    "location": "Locația"
  },
  "days": [
    {
      "id": "day-1",
      "date": "2025-05-01",
      "dayLabel": "Joi, 1 Mai",
      "activities": [
        {
          "id": "d1-a1",
          "startTime": "10:00",
          "endTime": "12:00",
          "title": "Activitate",
          "type": "session",
          "icon": "📖"
        }
      ]
    }
  ]
}
```

## Opțiuni de Configurare

### Theme (Tema)

Alege una din cele 4 teme disponibile:

```javascript
theme: 'mountain-retreat'    // Pentru tabere/retrageri
theme: 'professional'        // Pentru conferințe profesionale
theme: 'community-church'    // Pentru evenimente bisericești
theme: 'festival-bright'     // Pentru evenimente tineret/festivaluri
```

### Display Mode (Mod de Afișare)

```javascript
displayMode: 'tabs'          // Butoane pentru fiecare zi (implicit)
displayMode: 'accordion'     // Zilele sunt expandabile
displayMode: 'full-scroll'   // Toate zilele vizibile, scroll
displayMode: 'timeline'      // Vizualizare tip timeline
```

### Opțiuni Suplimentare

```javascript
ScheduleWidget.init({
    containerId: 'schedule-container',
    data: scheduleData,
    theme: 'mountain-retreat',
    displayMode: 'tabs',
    options: {
        showSearch: true,        // Afișează bara de căutare
        enableExport: true,      // Permite export în calendar
        showIcons: true,         // Afișează icon-uri pentru activități
        language: 'ro',          // Limba (ro/en)
        timeFormat: '24h',       // Format oră (24h/12h)
        highlightCurrent: true   // Evidențiază activitatea curentă
    }
});
```

## Tipuri de Activități

Widget-ul suportă următoarele tipuri de activități:

| Type | Label | Icon | Culoare |
|------|-------|------|---------|
| `logistics` | Logistică | 📋 | Gri |
| `session` | Sesiune | 📖 | Albastru |
| `meal` | Masă | 🍽️ | Portocaliu |
| `break` | Pauză | ☕ | Galben |
| `worship` | Închinare | 🙏 | Violet |
| `recreation` | Recreere | ⚽ | Verde |
| `meeting` | Întâlnire | 👥 | Roz |
| `other` | Altele | 📌 | Gri închis |

## Exemple de Utilizare

### Exemplu 1: Tabără Simplă

```html
<script>
ScheduleWidget.init({
    containerId: 'schedule',
    data: tabaraData,
    theme: 'mountain-retreat',
    displayMode: 'tabs'
});
</script>
```

### Exemplu 2: Conferință cu Căutare

```html
<script>
ScheduleWidget.init({
    containerId: 'schedule',
    data: conferenceData,
    theme: 'professional',
    displayMode: 'accordion',
    options: {
        showSearch: true,
        showSpeakers: true
    }
});
</script>
```

### Exemplu 3: Eveniment Biserică - Afișare Completă

```html
<script>
ScheduleWidget.init({
    containerId: 'schedule',
    data: churchEventData,
    theme: 'community-church',
    displayMode: 'full-scroll'
});
</script>
```

## Customizare Avansată

### Override CSS Variables

Poți customiza culorile temei direct în CSS:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --accent-color: #your-color;
    --text-color: #your-color;
    --background-color: #your-color;
}
```

### Callback Functions

```javascript
ScheduleWidget.init({
    // ... alte opțiuni
    onActivityClick: function(activity) {
        console.log('S-a dat click pe:', activity.title);
    },
    onDayChange: function(dayId) {
        console.log('S-a schimbat ziua la:', dayId);
    }
});
```

## Schema JSON Completă

Vezi fișierul `schedule-schema.json` pentru schema completă și validare.

Câmpuri obligatorii:
- `eventInfo.title`
- `eventInfo.dateRange`
- `days[].id`
- `days[].date`
- `days[].dayLabel`
- `days[].activities[].id`
- `days[].activities[].startTime`
- `days[].activities[].title`
- `days[].activities[].type`

Câmpuri opționale:
- `endTime` - Ora de sfârșit
- `description` - Descriere detaliată
- `location` - Locație specifică
- `speakers` - Lista vorbitorilor
- `icon` - Icon custom
- `isOptional` - Dacă e opțional
- `tags` - Tag-uri pentru filtrare

## Browser Support

- ✅ Chrome (ultimele 2 versiuni)
- ✅ Firefox (ultimele 2 versiuni)
- ✅ Safari (ultimele 2 versiuni)
- ✅ Edge (ultimele 2 versiuni)
- ⚠️ IE11 (suport parțial cu polyfills)

## Performance

- Bundle size: < 50KB (minified + gzipped)
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Mobile optimized: 60fps animations

## Accessibility

Widget-ul respectă standardele WCAG 2.1 AA:
- ✅ Navigare completă cu tastatură
- ✅ Screen reader friendly
- ✅ Contrast suficient pentru text
- ✅ Focus indicators clare
- ✅ ARIA labels pentru toate elementele interactive

## Troubleshooting

### Widget-ul nu se încarcă

1. Verifică dacă ai inclus corect CSS și JS
2. Verifică console-ul pentru erori
3. Asigură-te că JSON-ul este valid

### Stilurile nu arată bine

1. Verifică dacă ai inclus tema CSS corectă
2. Verifică dacă există conflicte CSS cu site-ul tău
3. Asigură-te că folosești un container cu lățime suficientă

### JSON-ul nu este acceptat

1. Validează JSON-ul cu schema
2. Verifică dacă toate câmpurile obligatorii există
3. Verifică formatele datelor (ore în HH:MM, date în YYYY-MM-DD)

## Licență

MIT License - Liber de utilizat în proiecte personale și comerciale.

---

**Versiune:** 1.0.0  
**Ultima actualizare:** Ianuarie 2026
