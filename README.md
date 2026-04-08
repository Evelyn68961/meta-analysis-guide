# Meta-Analysis 101

A bilingual (繁體中文 / English) interactive platform that teaches systematic review and meta-analysis methodology — from first principles to running real analyses in the browser.

🔗 **Live site:** [meta-analysis-101.vercel.app](https://meta-analysis-101.vercel.app)

## What's Inside

**Six courses (C0–C5)** introduce core concepts through interactive content and dinosaur-themed mini-games. Each course unlocks the next stage of your dino's journey:

- **C0 — What Is Meta-Analysis?** The core concept, explained with a restaurant-review analogy. Collect dinosaur eggs by answering quiz questions.
- **C1 — Why It Matters** How combining studies leads to stronger evidence and real-world impact. Hatch your eggs into dinosaurs.
- **C2 — Watch It Happen** An animated demo where five studies merge into one pooled estimate. Rescue food for your dinos.
- **C3 — How It's Done** An 8-step methodology guide with expandable details and cooking analogies. Save your dinos' homes.
- **C4 — Effect Sizes & Forest Plots** Effect size types (OR, RR, MD, SMD), weighting, fixed vs. random effects, and an interactive forest plot builder. Earn keys for your dinos.
- **C5 — Heterogeneity & Publication Bias** I², Q statistic, funnel plots, Egger's test, and why not all variation is random. Guide your dinos through the final escape.

**Two AI-assisted workshops** let you plan and execute a complete meta-analysis on your own data:

- **Midterm Workshop** — Define your PICO, build a search strategy, add studies, extract data, and assess risk of bias. AI validates your PICO and search strategy.
- **Final Workshop** — Choose effect sizes, run real R code in the browser via WebR + metafor, generate forest and funnel plots, and draw conclusions. AI interprets your results and recommends which advanced analyses to explore (leave-one-out, trim-and-fill, Egger's test, subgroup, meta-regression).

**Easter Egg Quiz** — 35 questions across 7 categories, each represented by a collectible dinosaur egg. Downloadable cheat sheets for each category.

## How AI Works Here

AI acts as a methodology advisor — it looks at your specific results and tells you what to explore next and why. AI never writes R code. JavaScript assembles all code from static, pre-tested templates based on AI's structured recommendations. Same inputs → same R code → same results.

## Tech Stack

- React (CRA) with inline styles
- PWA — installable, offline-capable via service worker
- Supabase — auth, progress tracking, AI gating
- WebR (WASM) + metafor — real R execution in the browser
- Vercel — hosting and serverless API proxy for AI calls
- Bilingual — custom `useI18n()` hook (Traditional Chinese / English)

## Content Sources

Content grounded in established methodological frameworks including the PRISMA 2020 guidelines, the Cochrane Handbook, and peer-reviewed meta-analysis tutorials.

## License

MIT

## Author

**[Evelyn Chang](https://github.com/Evelyn68961)** · PharmD, MSc · [ORCID](https://orcid.org/0009-0006-3175-7657)

Department of Pharmacy, Fu Jen Catholic University Hospital (輔仁大學附設醫院藥劑部)

## Related Projects

- **[EBMouse](https://ebmouse.vercel.app)** — Guided EBM learning platform for competition prep (5A workflow → auto-generated slides)
- **[Slidecast](https://slidecast-cyan.vercel.app)** — Internal pharmacy podcast/learning platform
