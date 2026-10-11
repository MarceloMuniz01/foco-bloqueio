# 🔒 Foco Bloqueio

**A lightweight, customizable focus reminder page and a schedule-based website blocker for Via Browser.**

Foco Bloqueio helps you interrupt distracting browsing habits. When a website matches a blocking rule outside its allowed hours, the optional `addon.js` userscript redirects the browser to a motivational page that reminds you of your goals and when the website will be available again.

The project separates **blocking rules** (`addon.js`) from **presentation** (`index.html`). The same hosted page can be reused by different people, each with their own schedule, websites, goals, and messages.

## ✨ Features

- **Two schedule-based blocklists:** one with a midday break and an evening unlock, and another with an evening-only unlock.
- **Wildcard domain matching:** supports patterns such as `*.youtube.com`, `youtube.*`, and `*example*`.
- **Motivational redirect:** sends blocked visits to an independent HTTPS page instead of modifying the target website's DOM.
- **Customizable messages:** blocked site, heading, description, goal, next action, unlock time, and footer.
- **Light and dark themes**, responsive layout, and no external JavaScript libraries.
- **Privacy-conscious URL parameters:** the userscript places personalized values in the URL fragment (`#`).
- **No account, database, or backend** required for the static page.

## 📁 Repository structure

- `index.html` — Standalone motivational page.
- `addon.js` — Via Browser userscript: domain matching, schedules, and redirects.
- `README.md` — Project documentation.

## 🚀 Getting started

### 1. Host the motivational page

You can deploy `index.html` to any HTTPS static hosting service.

For GitHub Pages:

1. Fork or clone this repository, or upload its contents to your own repository.
2. Open **Settings → Pages** in your GitHub repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/(root)`, then save.
5. Wait for GitHub Pages to publish the site.

Your URL will typically look like:

`https://YOUR_USERNAME.github.io/foco-bloqueio/`

You can also use `index.html` on its own as a customizable reminder page, without installing the blocker.

### 2. Install and configure `addon.js` in Via Browser

`addon.js` is a **userscript**, not a standalone Android app or Chrome extension.

1. Open [addon.js](./addon.js) and copy its complete contents.
2. In **Via Browser**, open the browser's scripts/userscripts settings (the menu name may vary by version), create a new script, and paste the code.
3. Save and enable the script. If the browser asks which websites the script may run on, allow the intended websites.
4. Edit the `CONFIG` object at the beginning of the script. Most importantly, replace the example `pagina` URL with your actual HTTPS page.
5. Add your own domain patterns, schedules, and motivational messages.
6. Visit a matching website outside its allowed hours to test the redirect.

**Important:** The repository currently uses `https://YOUR_USER.github.io/foco-bloqueio/` as an example in `addon.js`. Replace `YOUR_USER` with a real GitHub username before using it. The existing placeholder check looks for a different string (`SEU_USUARIO`), so it does not catch the shipped `YOUR_USER` placeholder.

## ⚙️ addon.js configuration

The script's `CONFIG` object contains the settings users normally need to change:

| Setting | Purpose | Current example |
|---|---|---|
| `pagina` | HTTPS URL of the motivational page | `https://YOUR_USER.github.io/foco-bloqueio/` |
| `almoco.inicio` | Start of the midday allowance | `12:00` |
| `almoco.fim` | End of the midday allowance (exclusive) | `13:00` |
| `noite` | Time when both lists become available | `17:30` |
| `sitesAlmoco` | Domains allowed at midday and after the evening unlock | YouTube, Instagram, TikTok examples |
| `sitesNoite` | Domains allowed only after the evening unlock | `*anything*` placeholder |
| `tema` | Motivational page theme | `escuro` or `claro` |
| `textos` | Personalized heading, message, goal, action, and footer | Portuguese sample messages |

**Example configuration excerpt:**

```javascript
const CONFIG = {
  pagina: 'https://YOUR_USERNAME.github.io/foco-bloqueio/',
  almoco: { inicio: '12:00', fim: '13:00' },
  noite: '17:30',
  sitesAlmoco: ['*.youtube.com', 'youtu.be', '*.instagram.com'],
  sitesNoite: ['*example*'],
  tema: 'escuro',
  textos: {
    titulo: 'Stay focused on what matters.',
    mensagem: 'You can come back to this later.',
    objetivo: 'Finish my personal project.',
    acao: 'Work on one small task for 25 minutes.',
    rodape: 'Small steps, lasting results.'
  }
};
```

This is an example excerpt: edit the configuration in the existing file rather than replacing the entire script with this snippet.

### How the two blocklists work

With the default schedule, the rules are:

| Local time | `sitesAlmoco` | `sitesNoite` |
|---|---|---|
| 00:00–11:59 | Blocked | Blocked |
| 12:00–12:59 | Allowed | Blocked |
| 13:00–17:29 | Blocked | Blocked |
| 17:30–23:59 | Allowed | Allowed |

- Times use the device's **local clock** and 24-hour `HH:MM` format.
- The end of the midday window is exclusive: at exactly `13:00`, midday sites are blocked again on the next script execution.
- **`sitesNoite` takes precedence** if a domain matches both lists.
- Unlisted websites are unaffected.

### Wildcard rules

Patterns are matched against the **hostname**, not the entire URL:

| Pattern | Example matches |
|---|---|
| `youtube.com` | `youtube.com` only |
| `*.youtube.com` | `youtube.com`, `www.youtube.com`, `m.youtube.com` |
| `*example*` | Any hostname containing `example` |
| `youtube.*` | `youtube.com`, `youtube.org`, etc. |

The asterisk (`*`) matches zero or more characters. Paths such as `/watch?v=...` are **not** evaluated by the matcher.

### What happens on a blocked visit?

1. The userscript runs when a matching page starts loading (`document-start`).
2. It checks the top-level page's hostname and the device's current local time.
3. It determines which blocklist applies and calculates the next unlock time.
4. It builds URL parameters using `URLSearchParams`.
5. It navigates to the configured HTTPS page with `location.replace()`, passing the parameters after `#`.
6. The hosted `index.html` displays the personalized message.

The script avoids the need to overwrite the DOM of single-page applications such as YouTube.

## 🎨 Motivational page parameters (index.html)

All parameters are optional. If a value is omitted, the page displays its default content.

| Parameter | Meaning |
|---|---|
| `site` | Blocked hostname or label |
| `titulo` | Main heading |
| `mensagem` | Supporting message |
| `objetivo` | Personal goal |
| `acao` | Suggested next action |
| `liberacao` | Next permitted access time, displayed as text |
| `rodape` | Footer message |
| `tema` | `escuro` or `claro` |

Example URL (replace the username with your own):

`https://YOUR_USERNAME.github.io/foco-bloqueio/#site=youtube.com&titulo=Time+to+focus&objetivo=Finish+my+project&liberacao=Today+at+17%3A30&tema=escuro`

The page accepts parameters in either the URL **fragment (`#`)** or **query string (`?`)**. If a nonempty fragment exists, it takes precedence over the query string.

The page inserts the values as text with `textContent` and limits text fields to 600 characters.

**Note:** The page displays `liberacao` but does not calculate or enforce schedules. That is the responsibility of `addon.js` or another blocker.

## 🔐 Privacy and security

- Parameters placed after `#` are **not included in the HTTP request** for the hosted HTML page.
- The page's JavaScript reads those parameters locally; the current implementation does not include analytics or third-party JavaScript dependencies.
- User-provided text is inserted using `textContent`, rather than interpreted as HTML markup.
- Fragments are **not secret or encrypted**: they can remain in browser history, bookmarks, screenshots, and shared links, and page scripts can read them.
- The hosting provider still receives ordinary requests for `index.html`, including standard connection metadata such as an IP address.

## ⚠️ Limitations

- **Not a network-level blocker.** Users can disable the userscript, use another browser, or otherwise bypass its rules.
- **No continuous schedule monitoring.** `addon.js` checks the time when the userscript executes. Already-open tabs do not automatically become blocked or unblocked as the clock changes.
- **SPA navigation may not trigger a new check.** Changes to the URL made within an already loaded single-page application may not run the userscript again.
- **No automatic return navigation.** The motivational page does not automatically reopen a blocked website when access becomes permitted.
- **Browser-dependent behavior.** Userscript injection and redirect permissions depend on the Via Browser version and settings.
- The current code uses the device's local time and expects ordinary daytime schedules; cross-midnight allow windows are not implemented.

## 🛠️ Tech stack

- HTML5 and CSS3 for the static page.
- Vanilla JavaScript for URL parameter rendering and matching/scheduling logic.
- GitHub Pages or any equivalent HTTPS static hosting service.
- Via Browser userscript support for optional blocking.

## 🤝 Contributing

Issues and pull requests are welcome. Useful improvements include additional translations, accessibility enhancements, browser compatibility testing, and optional schedule configurations.

---

**Make time for what matters.**

*Discipline today. Freedom tomorrow.*
