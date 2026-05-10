# Pokédex

A responsive Pokédex web app built with vanilla HTML, CSS and JavaScript using the [PokéAPI](https://pokeapi.co).

**Live:** https://alexander-lindt.developerakademie.net/Pokedex/

---

## Features

- **20 Pokémon** rendered on load, expandable via *Load More*
- **Search** by name or ID (min. 3 characters)
- **Detail Overlay** with tabs: About · Base Stats · Evolution · Moves
- **Keyboard navigation** — Arrow keys to browse, Escape to close
- **Lazy loading** — Species & Evolution Chain only fetched on card click
- **Caching** — every API response stored, never fetched twice
- **Pokéball loading spinner** with user feedback
- **Fully responsive** down to 320 px

---

## Project Structure

```
Pokédex/
├── index.html          # Main entry point
├── favicon.svg         # Browser tab icon
├── css/
│   └── style.css       # All styles (17 sections, see ToC inside)
└── js/
    ├── api.js          # Fetch logic & cache
    ├── render.js       # HTML template functions
    └── app.js          # State, events & app logic
```

---

## JavaScript Architecture

| File | Responsibility |
|------|---------------|
| `api.js` | PokéAPI calls + in-memory cache |
| `render.js` | Pure functions that return HTML strings |
| `app.js` | State management, DOM events, loading flow |

### app.js sections
1. **STATE** — central app state object
2. **UI HELPERS** — show/hide, tab switching, stat bars
3. **GRID & LOADING** — fetch + render flow, load more
4. **OVERLAY** — open, close, navigate
5. **SPECIES & EVOLUTION** — lazy-loaded detail data
6. **SEARCH** — query handling
7. **EVENT LISTENERS** — all DOM bindings
8. **INIT** — DOMContentLoaded entry point

---

## Technologies

- HTML5 · CSS3 · Vanilla JavaScript (ES2020+)
- [PokéAPI v2](https://pokeapi.co/api/v2)
- No frameworks, no build tools

---

## Concepts Applied

| Concept | Where |
|---------|-------|
| Lazy Loading | Evolution chain fetched on first overlay open |
| Fetch-then-Render | All data resolved before DOM update |
| Caching | `cache` object in `api.js` |
| Responsive Design | CSS Grid + media queries (320 px – 1440 px) |
| camelCase & max. 14 lines/function | Throughout all JS files |
