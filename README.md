# PawMatch — Three-sided Prototype

A mobile-first interactive prototype for pet adoption, built end-to-end across
three apps that share one design system and one user story.

## Try it

Open `index.html` (or, on GitHub Pages, the repo root URL) to land on a chooser
with three apps:

| App | File | Persona |
| --- | --- | --- |
| **Adopter** | `PawMatch-standalone.html`         | Sarah Chen, Portland OR |
| **Shelter** | `PawMatch-Shelter-standalone.html` | Meadow Park · Willow Creek Rescue |
| **Vet**     | `PawMatch-Vet-standalone.html`     | Dr. Anjali Patel · Forest Park Veterinary |

Each `*-standalone.html` is fully self-contained — double-click it from
your filesystem, or share the URL once the repo is on GitHub Pages. The cross-end
demo follows **Sarah Chen + Poppy** through every app.

## Project layout

```
PawMatch.html              # multi-file entry for the adopter app
PawMatch-Shelter.html      # multi-file entry for the shelter app
PawMatch-Vet.html          # multi-file entry for the vet app
PawMatch-*-standalone.html # single-file builds (what you share)

ios-frame.jsx              # iOS device frame
ui.jsx                     # design tokens + shared primitives (PMButton, Chip, TabBar, EmptyState…)
pet-art.jsx                # hand-drawn pet illustrations

screens-auth.jsx           # adopter splash / register / login / onboarding
screens-swipe.jsx          # adopter swipe deck, search, match-check, pet detail
screens-matches.jsx        # adopter matches + chat
screens-stubs.jsx          # adopter vet-find / insurance / checkout / upload / profile
app.jsx                    # adopter route stack

screens-shelter-*.jsx      # shelter screens (auth / home / pets / forms / misc)
shelter-data.jsx           # shelter mock data
app-shelter.jsx            # shelter route stack

screens-vet-*.jsx          # vet screens (auth / home / appointments / notes / claims / misc)
vet-data.jsx               # vet mock data
app-vet.jsx                # vet route stack

assets/splash-hero.jpg     # cover illustration (shared across all three apps)
build_standalone.py        # bundles each shell into a self-contained HTML
start.sh                   # python http.server on :8080 for dev
```

## Develop

Edit any `*.jsx` file, then either:

* **Live-edit** — run `./start.sh` and open `http://localhost:8080/PawMatch.html`
  (or `…/PawMatch-Shelter.html`, `…/PawMatch-Vet.html`). Babel-standalone JIT
  compiles JSX in the browser, so a refresh is enough.
* **Re-bundle** — run `python3 build_standalone.py` to regenerate all three
  `*-standalone.html` files with everything inlined.
