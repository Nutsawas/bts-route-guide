# BTS / MRT / ARL Route Guide

A single-page web app for finding train routes on Bangkok’s BTS Skytrain, MRT (Blue, Purple, Yellow, Pink lines), and Airport Rail Link (ARL). Pick origin and destination by line and station; the app shows which lines to take, where to change trains, and which platform direction to use (e.g. “towards …”).

## What it does

- **Route search**: Choose origin line/station and destination line/station. The app computes a path and shows each leg (line + segment) and transfer points.
- **Direction hints**: For each leg it shows which terminus direction to take (e.g. “towards Kheha”).
- **Lines covered**: BTS Sukhumvit, BTS Silom, BTS Gold Line, MRT Blue, MRT Purple, MRT Yellow, MRT Pink, and Airport Rail Link. Station names are in Thai and English.

## How to run

1. Clone or download this repo.
2. Serve the folder with any static HTTP server. Examples:

   **Python 3:**
   ```bash
   cd bts-route-guide
   python3 -m http.server 8080
   ```

   **Node (npx):**
   ```bash
   npx serve .
   ```

3. Open in a browser:
   - Main entry: **`index.html`** → e.g. [http://localhost:8080](http://localhost:8080) or [http://localhost:8080/index.html](http://localhost:8080/index.html)
   - Standalone copy: **`open-me.html`** — same app; you can open it directly (e.g. `file://`) or link to it for a second entry point.

No build step or `npm install` is required; the app runs with plain HTML, CSS, and JavaScript.

## Deploy on GitHub Pages (run as a real website)

You can host this app for free on **GitHub Pages** so it runs as a real website (e.g. `https://<your-username>.github.io/bts-route-guide/`).

1. Push this repo to GitHub (create a repo and push if you haven’t already).
2. In the repo on GitHub: **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: choose `main` (or your default branch), folder **/ (root)**
4. Click **Save**. After a minute or two, the site will be live at:
   - **`https://<your-username>.github.io/bts-route-guide/`**  
   (Replace `<your-username>` and `bts-route-guide` with your GitHub username and repo name.)

The app is static (no server or build step), so it works on GitHub Pages as-is. Every push to the chosen branch will update the published site.

## How to use

1. **Origin**: Select the origin line, then the origin station.
2. **Destination**: Select the destination line, then the destination station.
3. Click **“ค้นหาเส้นทาง”** (Find route).
4. Read the result: each line shows a segment (e.g. “BTS Sukhumvit: Mo Chit → Victory Monument”) and, when relevant, a transfer note and direction (e.g. “Change at Siam (towards Kheha)”).

## Project structure (files)

| File / folder | Purpose |
|---------------|--------|
| **`index.html`** | Main app page. Self-contained: inline styles, `LINES` data, route-finding logic, and UI script. Use this as the primary entry. |
| **`open-me.html`** | Same app as `index.html`, duplicated so it can be opened alone (e.g. from `file://` or another URL). Update it when you update `index.html` if you want both to stay in sync. |
| **`src/data/lines.js`** | Source of truth for lines and stations (BTS, MRT, ARL). Defines `LINES`: each line has `id`, `name`, `nameEn`, and `stations` (each with `id`, `nameTh`, `nameEn`). Same station `id` on different lines = interchange. When you add or edit stations, update this file and then copy the updated `LINES` (and any route logic that uses it) into `index.html` and `open-me.html`. |
| **`src/data/interchanges.js`** | Optional explicit interchange list. The route finder can derive interchanges from `LINES` (same station `id` on multiple lines); this file is for reference or future use. |
| **`src/logic/routeFinder.js`** | Route-finding logic (e.g. BFS over lines and interchanges). Used by the inline script in the HTML; when you change the algorithm, update this file and sync the relevant code into the HTML. |
| **`src/app.js`** | UI logic: populating line/station dropdowns, calling the route finder, and rendering the result. Same as above: source lives here; the running app uses the inlined copy in the HTML. |
| **`package.json`** | Project metadata. No npm scripts are required to run the app. |

## Data and maintenance

- Station names (Thai and English) and line lists are maintained in **`src/data/lines.js`**.
- After editing `lines.js`, the same `LINES` (and, if changed, `routeFinder` / `app` logic) must be copied into the `<script>` sections of **`index.html`** and **`open-me.html`** so the live app stays up to date. There is no automatic bundle step.
- Data is based on public maps and official sources; update when new lines or stations open.

## License

Use and modify as you like. Station data is from public/official sources.
