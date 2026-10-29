# my_react_portfolio

This repo contains the source for [3manuel.dev](https://3manuel.dev) (deployed via `npm run deploy` to GitHub Pages).

## Notes
- GitHub API calls in the app are cached in `localStorage` (6h TTL) for repos.
- Top languages image: `public/top-languages.svg` (generated from live repos). 
  - Raw: https://raw.githubusercontent.com/3manuel0/my_react_portfolio/main/public/top-languages.svg
  - Regenerate every 3-4 days: `python3 /tmp/gen_toplangs_fix2.py` (script at `/tmp/gen_toplangs_fix2.py` or recreate as needed). 
  - If GitHub API is down/rate-limited, the SVG in this repo is the fallback.

## Quick commands
```bash
npm run dev
npm run build
npm run deploy
```
