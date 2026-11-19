# TechBridge CV Builder

An interactive workshop site and document builder for **CVs, resumes and cover letters**, built for a TechBridge university tech club workshop. Plain HTML, CSS and JavaScript: no build step, no backend, no cost.



## What it does

| Tab | Purpose |
|---|---|
| Overview | CV vs resume vs cover letter, length guide |
| CV anatomy | The five standard CV sections and formatting rules |
| Write it well | Action verbs, duty-to-result bullets, cover letter structure |
| Dos and don'ts | Per-document checklists |
| Good vs bad | Side-by-side example documents |
| Build yours | Live document builder (below) |

## Builder features

| Feature | Details |
|---|---|
| Templates | Resume, CV, cover letter |
| Section ordering | Move sections up or down, switch them on or off (resume and CV) |
| Personal information | Edit every field and choose which ones appear |
| Photo | Optional. Upload, auto-crop to a square, include or remove with one click |
| Style | Arial by default at 11 pt (12 pt option), as recommended for CVs; accent colour; serif option; left or centred header; 0.75 in print margins |
| Export | PDF (print dialog), Word `.doc`, HTML, plain text, Markdown |
| Projects | Save and load your work as `.json`; autosaves in your browser |
| AI (optional) | "Improve with AI" polishes your notes. No login and no API key for users |

Photos suit some countries and not others, so the photo is off by default. For documents with a photo, use the **PDF** export; Word may not display embedded photos.


## Enable the AI assistant

No login and no API key for users. The page sends the request to a small Cloudflare Worker that holds the key.

```
Browser --(prompt)--> Cloudflare Worker --> limits check --> OpenRouter free model --> text back
```


## Project structure

```
index.html        page markup
css/styles.css    styles (TechBridge palette, dark mode)
js/site.js        workshop content tabs
js/builder.js     document builder, ordering, photo, exports, AI
js/config.js      public settings (webhook URL)
worker/           Cloudflare Worker that holds the AI key (worker.js, wrangler.toml)
```

## Tech stack

| Layer | Choice |
|---|---|
| Markup, styles, logic | HTML, CSS, vanilla JavaScript |
| Hosting | GitHub Pages (free) |
| AI proxy (optional) | Cloudflare Worker (free plan), OpenRouter free model router |

## Privacy

Everything you type, including your photo, stays in your browser (local storage and exported files). Only the optional AI button sends text, through your Cloudflare Worker to OpenRouter; your IP address is used for the daily limit.

## Credits

CV vs resume guidance is adapted from Med School Insiders ([video](https://youtu.be/tHQXZJ2f00Y), [article](https://medschoolinsiders.com/pre-med/cv-vs-resume/)). Cover letter and tech-student tips are original to this project.

## License

MIT
