#!/usr/bin/env python3
"""Build self-contained standalone HTML files from every PawMatch shell.

Currently builds:
  PawMatch.html         → PawMatch-standalone.html         (adopter side)
  PawMatch-Shelter.html → PawMatch-Shelter-standalone.html (shelter side)

Each output inlines every external .jsx and bakes binary assets the JSX expects
via window globals (right now: the splash hero image), so a single .html file
can be opened directly from file:// with no other dependencies."""
import re, pathlib, base64, mimetypes

HERE = pathlib.Path(__file__).resolve().parent

SHELLS = [
    (HERE / "PawMatch.html",          HERE / "PawMatch-standalone.html"),
    (HERE / "PawMatch-Lato.html",     HERE / "PawMatch-Lato-standalone.html"),
    (HERE / "PawMatch-Shelter.html",  HERE / "PawMatch-Shelter-standalone.html"),
    (HERE / "PawMatch-Vet.html",      HERE / "PawMatch-Vet-standalone.html"),
]

JSX_PAT = re.compile(
    r'<script\s+type="text/babel"\s+src="([^"]+\.jsx)"\s*></script>',
    re.IGNORECASE,
)

def inline_jsx(match):
    rel = match.group(1)
    code = (HERE / rel).read_text(encoding="utf-8")
    return f'<script type="text/babel" data-source="{rel}">\n/* {rel} */\n{code}\n</script>'

def data_url(path):
    mime = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"

def build(src, out):
    if not src.exists():
        print(f"skip (missing): {src.name}")
        return
    html = src.read_text(encoding="utf-8")
    html = JSX_PAT.sub(inline_jsx, html)

    # Bake any window-global binary assets the JSX expects.
    asset_lines = []
    splash = HERE / "assets" / "splash-hero.jpg"
    if splash.exists():
        asset_lines.append(f'  window.__PAWMATCH_SPLASH_HERO__ = "{data_url(splash)}";')

    # Pet photos — each becomes window.__pmPetPhotos[key]
    pets_dir = HERE / "assets" / "pets"
    if pets_dir.is_dir():
        pet_files = sorted(pets_dir.glob("*.jpg"))
        if pet_files:
            asset_lines.append('  window.__pmPetPhotos = window.__pmPetPhotos || {};')
            for pf in pet_files:
                key = pf.stem  # e.g. "poppy", "hope"
                asset_lines.append(f'  window.__pmPetPhotos["{key}"] = "{data_url(pf)}";')

    if asset_lines:
        asset_block = (
            "<script>\n  /* PawMatch baked-in assets — injected by build_standalone.py */\n"
            + "\n".join(asset_lines)
            + "\n</script>"
        )
        html = re.sub(
            r'(<script\s+src="https://unpkg\.com/react@)',
            asset_block + "\n  \\1",
            html,
            count=1,
        )

    out.write_text(html, encoding="utf-8")
    print(f"wrote {out.relative_to(HERE.parent)} ({len(html):,} bytes)")

if __name__ == "__main__":
    for src, out in SHELLS:
        build(src, out)
