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

## Instalare Rapidă

### 1. Include fișierele în HTML

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Programul Evenimentului</title>
    
    <!-- Include CSS-ul widget-ului -->
    <link rel="stylesheet" href="schedule-widget.css">
    
    <!-- Include tema dorită -->
    <link rel="stylesheet" href="themes/mountain-retreat.css">
</head>
<body>
    <!-- Container pentru widget -->
    <div id="schedule-container"></div>
    
    <!-- Include JavaScript-ul -->
    <script src="schedule-widget.js"></script>
    
    <!-- Inițializare -->
    <script>
        fetch('tabara2025.json')
            .then(response => response.json())
            .then(data => {
                ScheduleWidget.init({
                    containerId: 'schedule-container',
                    data: data,
                    theme: 'mountain-retreat',
                    displayMode: 'tabs'
                });
            });
    </script>
</body>
</html>
```

### 2. Pregătește JSON-ul cu datele

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

## Suport

Pentru întrebări și probleme:
- Email: support@example.com
- GitHub Issues: github.com/user/schedule-widget

## Licență

MIT License - Liber de utilizat în proiecte personale și comerciale.

---

**Versiune:** 1.0.0  
**Ultima actualizare:** Ianuarie 2026
