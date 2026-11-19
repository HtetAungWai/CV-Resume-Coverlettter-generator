# TechBridge CV Builder

An interactive workshop site and document builder for **CVs, resumes and cover letters**, built for a TechBridge university tech club workshop. Plain HTML, CSS and JavaScript: no build step, no backend, no cost.

## Theme

A space-opera look: animated starfield with a hyperspace jump between tabs, an opening-crawl intro, glowing top navigation and scroll reveals. It respects `prefers-reduced-motion`. It is an unofficial fan-style theme: it uses no official logos, artwork or fonts, and is not affiliated with Lucasfilm or Disney.

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

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings, Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`.
3. Your site appears at `https://<username>.github.io/<repo>/`.

## Enable the AI assistant

No login and no API key for users. The page sends the request to a small Cloudflare Worker that holds the key.

```
Browser --(prompt)--> Cloudflare Worker --> limits check --> OpenRouter free model --> text back
```

1. **Deploy the Worker.** Sign up at [cloudflare.com](https://www.cloudflare.com) (free plan). Go to **Workers & Pages, Create, Hello World**, name it `tb-cv-ai`, **Deploy**, then **Edit code**, replace everything with `worker/worker.js` and **Deploy** again. (CLI alternative: `cd worker && npx wrangler deploy`.)
2. **Add the key as a secret.** In the Worker, **Settings, Variables and Secrets, Add**: type **Secret**, name `OPENROUTER_KEY`, value = your key from [openrouter.ai](https://openrouter.ai) (Keys, Create Key). Deploy again.
3. **Connect the page.** Copy the Worker URL (`https://tb-cv-ai.<subdomain>.workers.dev`) into `js/config.js`. Opening that URL in a browser should show `{"error":"POST only."}`, which means it is live. Push to GitHub.

| Protection | How |
|---|---|
| API key never reaches the browser | It lives only as a Worker secret |
| Cost and abuse control | Fixed free model, prompt length cap, daily limit per visitor (IP) and overall |
| Optional | `ORIGINS` in `worker.js` rejects other websites; a KV namespace named `LIMITS` makes the daily limits durable |

Without login, anyone who finds the Worker URL can call it, and all visitors share one free OpenRouter quota. Without the KV namespace the limits are best-effort (they can reset when Cloudflare restarts the Worker). Treat this as a demo-grade setup and add sign-in later if you open the site to the public.

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
