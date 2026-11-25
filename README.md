# ASCII // STUDIO ✦

A sleek, dark, zero-build **ASCII & Unicode art studio** — copy-ready art, plus tools to make your own. Runs 100% in the browser (works offline, on phones too).

**Live:** https://theone-github.github.io/ascii-art-studio/

## What's inside

### ◈ Art Vault
32 hand-aligned pieces in 5 categories — copy any of them in one tap:
- **Flowers** — long-stem rose, lotus, bouquet, tulip, sunflower, sakura branch
- **Eyes** — shaded eye, anime eye, crying eye, starry eye, winking eye
- **Teddy & Cute** — teddy holding a heart, classic teddy, sleepy bear, bunny, cat, frog
- **Chess** — full starting board + king, queen, rook, bishop, knight, pawn
- **Aesthetic & Vibes** — hearts, butterfly, crown, sword, skull, moon & stars, music, dividers

Live search, category pills, and a **Discord ```** toggle that wraps everything you copy in a code block so it never gets mangled.

### ✦ Make Anything
- **Image → ASCII / Braille** — drop/upload/paste any picture (or try the built-in rose, eye, teddy, knight, moon). Four engines: Braille dots (⠀–⣿, 2×4 sub-pixels, dithered), Classic ASCII, Dense 70-level ramp, Block art (█▓▒░). Width, contrast and invert controls. Copy, or download `.txt` / `.png`.
- **Text Banner Maker** — type anything (A–Z, 0–9, punctuation) and get a big banner in ANSI Shadow, Solid Block or Retro ASCII, with optional box or star frames. Send it to the canvas to edit.
- **Draw Canvas** — click/drag ASCII sketchpad with brushes (`# * @ ♡ ░ ▒ █ . o / \ | - _ ( )`, custom char, eraser), **Mirror-X symmetry** (auto-flips `/ \ ( )`), undo, three grid sizes, a starter heart, copy & `.txt`.

## Run it
No build, no dependencies. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

## Files
| file | what |
| --- | --- |
| `index.html` | layout |
| `style.css` | dark terminal-luxe theme |
| `art-data.js` | the art vault (add your own pieces here!) |
| `app.js` | gallery, converter, banner font, draw canvas |

### Add your own art
Add an object to `ART_VAULT` in `art-data.js`:
```js
{ "id": "my-piece", "title": "My Piece", "category": "aesthetic", "tags": ["cool"], "art": "  /\\_/\\\n ( o.o )\n  > ^ <" }
```

Made by Himanshu ✦
