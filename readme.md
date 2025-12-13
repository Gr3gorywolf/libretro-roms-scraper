#  libretro-roms-scraper

A Node.js scraper that extracts **game thumbnails metadata** from the  
[`libretro-thumbnails`](https://github.com/libretro-thumbnails/libretro-thumbnails) project.

It resolves **Git submodules correctly**, normalizes game names to avoid duplicates,  
and outputs clean JSON files per console with:

- Boxarts
- Logos
- Gameplay screenshots
- Console mapping

Perfect for frontends, launchers, and emulation platforms.

---

## ✨ Features

- ✅ Supports **libretro submodules** (each system is a separate repository)
- ✅ Normalizes ROM names (avoids duplicates like updates, hacks, revisions)
- ✅ Picks the **best boxart / logo** automatically
- ✅ Collects **all gameplay screenshots**
- ✅ Generates **raw GitHub URLs** (no cloning required)
- ✅ One JSON file **per console**
- ✅ Simple configuration via constants (no CLI args)

---

## 📦 Output Format

Each game entry looks like this:

```json
{
  "title": "007 - Agent Under Fire",
  "size": "184322",
  "logo": "https://raw.githubusercontent.com/...",
  "title_image: "https://raw.githubusercontent.com/...",
  "portrait": "https://raw.githubusercontent.com/...",
  "gameplay_covers": [
    "https://raw.githubusercontent.com/...",
    "https://raw.githubusercontent.com/..."
  ],
  "console": "gc"
}
```


## How to run
In order to the scraper you must first export your github token variable:

```
export GITHUB_TOKEN=your_token_here
```

then run the script with node (18+ recommended)

```
node scraper.js
```