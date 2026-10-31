# Chanakarn — Personal Archive

An editable portfolio with projects, university studies, achievements and events. The About page has a scroll-driven 3D journey through four computer eras.

This directory contains the website. The repository-root `README.md` and `assets/` are the GitHub profile and remain separate.

## Deploy on Vercel

Import **Micosz/Micosz**, choose the **main** branch, and use:

| Setting | Value |
| --- | --- |
| Root Directory | `portfolio` |
| Framework Preset | Other |
| Build Command | Empty / skipped |
| Output Directory | `.` |
| Install Command | Empty / skipped |

`vercel.json` sets the static build settings. Select the Root Directory in Vercel's import screen. No API keys, environment variables or server are required.

The site uses hash routes such as `/#about` and `/#projects`; no SPA rewrite is needed. After deployment, use the actual Vercel URL when linking from the GitHub profile or CV.

Official setup reference: https://vercel.com/docs/builds/configure-a-build

## Run locally

From the repository root:

```sh
cd portfolio
python3 -m http.server 8000
```

Open http://localhost:8000/. Use HTTP rather than opening `index.html` directly, so the local 3D modules can load.

## Edit content

Open **Edit portfolio** in the footer, edit a section and save a browser-local draft. Download `content.js` from the editor, then replace `portfolio/content.js` and commit the change to publish it. Browser drafts do not update GitHub or other visitors' content.

Main files:

- `content.js`: profile, projects, education, achievements and events.
- `style.css`, `work.css`, `about.css`: visual styles.
- `study-computers.js`: computer model catalogue and era mapping.
- `study-journey.js`, `study-object.js`: scroll and 3D interaction.

## Sources and licenses

- `WORK-SOURCES.md`: project attribution and repository evidence.
- `ABOUT-SOURCES.md`: academic record interpretation and editing notes.
- `STUDY-MOTION-SOURCES.md`: 3D implementation, libraries and model sources.
- `assets/study/computers/CREDITS.md`: CC BY 3.0 model attribution.
- Three.js, Inter and Phosphor license files are retained alongside their assets.

The original transcript PDF, student ID, portrait, local screenshots and internal QA evidence are not bundled. Course records displayed by the portfolio are in `content.js`; the grade visibility toggle controls display only.
