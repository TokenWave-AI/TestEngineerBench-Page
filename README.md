<p align="center"><img src="assets/logo.png" width="850" alt="TestEngineerBench" /></p>

<p align="center"><b>Evaluating Coding Agents as Autonomous Software Test Engineers</b></p>
<p align="center"><a href="assets/paper.pdf">Paper</a> · Code & data: coming soon</p>

TestEngineerBench evaluates requirements-driven testing and defect discovery across **100 instances**, **78 Python repositories**, **16 application categories**, and **531 recorded defect occurrences**. Agents receive a product requirements document, a prerelease repository, and a configured execution environment, without issue descriptions or investigation targets.

This repository contains the project website, not the benchmark implementation. It presents the two independent tasks, sortable model results, and three trajectory case studies with direct references to the paper.

### Local preview

Requires Node.js 18 or newer. No packages or build step are required.

```sh
npm run dev
# http://localhost:4173
npm run check
```

### Hosting

All site resources use relative paths, supporting both root domains and GitHub Pages project paths. The included GitHub Actions workflow skips private repositories and deploys a curated static artifact on pushes to `main` or manual dispatch. Enable **Settings → Pages → Source → GitHub Actions** first. A private repository requires a GitHub plan that supports Pages for private repositories; this project does not change repository visibility.

Expected project URL after enabling Pages: `https://tokenwave-ai.github.io/TestEngineerBench-Page/`.

### Content and assets

- `index.html`, `style.css`, `script.js`: page, responsive styling, model tables, filters, cases, citation copying.
- `assets/paper.pdf`: user-supplied paper dated October 25, 2026.
- `assets/logo.svg` / `assets/logo.png`: transparent horizontal logo for a README or website.
- `assets/logo-display.png`: the same logo with transparent outer margins removed for alignment on the homepage.
- `assets/mascot.svg` / `assets/mascot.png`: standalone bear extracted from the approved logo.
- `assets/favicon.png`: small bear portrait for browser tabs.
- `assets/hero.svg`: original workbench illustration.
- `assets/social.png`: 1200 × 630 social preview.

The approved bear logo was supplied by the project author. `assets/logo.png` preserves the original transparent PNG exactly. The mascot is extracted from that artwork without redrawing, and the workbench and social preview reuse the same character. The `.svg` logo and mascot files are self-contained wrappers embedding the PNG artwork; they are not vector redraws. The logo can be reused in the benchmark repository with:

```md
<p align="center"><img src="assets/logo.png" width="850" alt="TestEngineerBench" /></p>
```

Copy `assets/logo.png` to the destination repository first.

### Results and provenance

All model numbers are transcribed from Tables 3 and 5 of the supplied PDF, not live leaderboard measurements. Appendix D supplies the Folium, Textual, and Superset case studies. Folium is explicitly labeled an archived evaluation. Displayed code excerpts omit surrounding setup; the Textual assertion is shortened and labeled accordingly. The footer, paper links, and metric notes preserve source context. Update `models`, `tracks`, and `cases` in `script.js` when revising results. Code/data resources are labeled coming soon until official destinations exist.

Visual direction is inspired by [Cambrian-S](https://cambrian-mllm.github.io/cambrian-s/): warm paper, serif typography, restrained color, and editorial figures. Benchmark-first organization also draws on [SWE-sweep](https://swesweep.com/). The bear follows the character in the paper’s Figure 1. The final logo was supplied and approved by the project author, with Active-SWE serving as a finish and lettering reference.
