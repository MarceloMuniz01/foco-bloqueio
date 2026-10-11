# Foco Bloqueio

**A privacy-conscious, customizable focus page and schedule-based website blocker for Via Browser.**

This repository contains two independent pieces:

- [`index.html`](./index.html): an HTTPS-hosted motivational page that reads English URL fragment parameters.
- [`addon.js`](./addon.js): a Via Browser userscript that checks hostnames and local time, then redirects blocked visits to that page.

No account, API key, framework, backend, analytics, or third-party JavaScript dependency is required.

## Getting started

1. Publish `index.html` on an HTTPS static host such as GitHub Pages.
2. Open `addon.js` and set `CONFIG.blockPageUrl` to your published URL.
3. In Via Browser, create a new userscript, paste the content of `addon.js`, save it, and enable it for the relevant websites. Menu labels may vary by Via version.
4. Configure your site groups, time windows, and messages. Disable older versions of the script to avoid conflicts.
5. Open a matching site outside its allowed time to test the redirect.

Example GitHub Pages URL: `https://YOUR_USER.github.io/foco-bloqueio/`.

## Userscript configuration

Configure `CONFIG` in `addon.js`:

```js
windows: {
  lunch: ['12:00', '13:00'],
  evening: ['17:30', '24:00']
},
groups: [
  { sites: ['*anything*'], access: ['evening'] },
  {
    sites: ['*.youtube.com', 'youtu.be', '*.instagram.com', '*.tiktok.com'],
    access: ['lunch', 'evening']
  }
]
```

- Times use the device's local 24-hour clock.
- Each access window uses a **start-inclusive, end-exclusive** interval. `24:00` means the end of the day.
- **First matching group wins**, so put more restrictive groups first.
- A domain not found in any group is unaffected.
- `*.youtube.com` matches `youtube.com` and its subdomains.
- `*anything*` matches any hostname containing `anything`.
- Matching applies to hostnames, **not** paths or query parameters.
- Each window must be within one calendar day; overnight windows are not supported.
- The script evaluates time when it executes, with no interval or mutation observer.

## Focus page parameters

The page reads **English-only** parameters from the URL **fragment (`#`)**:

| Parameter | Purpose |
| --- | --- |
| `site` | Blocked hostname |
| `title` | Main heading |
| `message` | Supporting message |
| `goal` | Personal goal |
| `action` | Suggested next action |
| `unlock` | Human-readable next unlock time |
| `footer` | Footer text |
| `theme` | `dark` or `light` |

All parameters are optional and have built-in defaults. Example:

```
https://YOUR_USER.github.io/foco-bloqueio/#site=youtube.com&title=Stay+focused&goal=Finish+my+project&unlock=Today+at+17%3A30&theme=dark
```

**Breaking change:** this version does not support the old Portuguese parameters (`titulo`, `mensagem`, `objetivo`, `acao`, `liberacao`, `rodape`, `tema`) or query-string parameters (`?`). Update both files together.

## Privacy and safety

The fragment is not sent as part of the HTTP request for `index.html`, so the hosting service does not receive the personalized values as URL query parameters. The HTML page has no trackers or third-party scripts, and it uses `textContent` to render parameters safely as text.

However, a fragment is **not encryption**: it can appear in the browser's history, bookmarks, screenshots, or shared links, and JavaScript running on the page can read it. A static host still sees normal connection metadata.

## Limitations

- This is a voluntary browsing aid, not an operating-system or network-level blocker.
- Browser support for userscripts and redirects varies.
- Already-open sites are not monitored when the clock changes.
- Single-page navigation that does not reload the document may not rerun the userscript.
- The focus page does not automatically reopen the original site after the unlock time.

**Discipline today. Freedom tomorrow.**
