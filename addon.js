
// ==UserScript==
// @name         Foco Bloqueio - Website Blocker
// @namespace    foco.via
// @version      2.1.0
// @description  Blocks websites by schedule and redirects to a customizable HTTPS focus page.
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  // =====================================
  // CONFIGURATION
  // =====================================

  const CONFIG = {
    // Replace with your GitHub Pages URL
    blockPageUrl:
      'https://YOUR_USER.github.io/foco-bloqueio/',

    lunch: {
      start: '12:00',
      end: '13:00'
    },

    eveningUnlock: '17:30',

    // Allowed during lunch and after 17:30
    lunchAndEveningSites: [
      '*.youtube.com',
      'youtu.be',
      '*.instagram.com',
      '*.tiktok.com'
    ],

    // Allowed only after 17:30
    eveningOnlySites: [
      '*anything*'
    ],

    theme: 'dark', // 'dark' or 'light'

    messages: {
      title:
        'You chose to protect your time.',

      description:
        'Entertainment can wait. Focus on what you want to build.',

      goal:
        'Build a successful career and achieve financial independence.',

      action:
        'Start with one small task and make progress on your goals.',

      footer:
        'Discipline today. Freedom tomorrow.'
    }
  };

  // =====================================
  // INITIAL CHECKS
  // =====================================

  // Run only in the top-level window.
  if (window.top !== window.self) return;

  // Make sure the user has configured the URL.
  if (CONFIG.blockPageUrl.includes('YOUR_USER')) {
    console.warn(
      '[Foco Bloqueio] Please configure your block page URL.'
    );
    return;
  }

  let blockPage;

  try {
    blockPage = new URL(CONFIG.blockPageUrl);

    // Only allow HTTPS redirect destinations.
    if (blockPage.protocol !== 'https:') {
      console.warn(
        '[Foco Bloqueio] The block page must use HTTPS.'
      );
      return;
    }
  } catch (error) {
    console.error(
      '[Foco Bloqueio] Invalid block page URL.',
      error
    );
    return;
  }

  // Prevent redirect loops.
  if (location.origin === blockPage.origin) {
    return;
  }

  const hostname = location.hostname
    .toLowerCase()
    .replace(/\.$/, '');

  // =====================================
  // WILDCARD MATCHING
  // =====================================

  function matchesPattern(domain, pattern) {
    const normalizedPattern = String(pattern)
      .trim()
      .toLowerCase();

    if (!normalizedPattern) return false;

    // *.youtube.com also matches youtube.com
    if (
      normalizedPattern.startsWith('*.') &&
      domain === normalizedPattern.slice(2)
    ) {
      return true;
    }

    // Escape regex special characters.
    const escapeRegex = part =>
      part.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    // Convert * into a regex wildcard.
    const regexPattern =
      '^' +
      normalizedPattern
        .split('*')
        .map(escapeRegex)
        .join('.*') +
      '$';

    return new RegExp(
      regexPattern,
      'i'
    ).test(domain);
  }

  function matchesList(list) {
    return list.some(pattern =>
      matchesPattern(hostname, pattern)
    );
  }

  // The more restrictive list takes priority.
  const eveningOnly = matchesList(
    CONFIG.eveningOnlySites
  );

  const lunchAndEvening = matchesList(
    CONFIG.lunchAndEveningSites
  );

  // Website is not in either blocklist.
  if (!eveningOnly && !lunchAndEvening) {
    return;
  }

  // =====================================
  // SCHEDULE CHECK
  // =====================================

  function toMinutes(time) {
    const [hours, minutes] = time
      .split(':')
      .map(Number);

    return hours * 60 + minutes;
  }

  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  const lunchStart = toMinutes(
    CONFIG.lunch.start
  );

  const lunchEnd = toMinutes(
    CONFIG.lunch.end
  );

  const eveningStart = toMinutes(
    CONFIG.eveningUnlock
  );

  // All configured websites are allowed
  // after the evening unlock time.
  if (currentMinutes >= eveningStart) {
    return;
  }

  // Lunch access is only available
  // to websites in the first blocklist.
  if (
    !eveningOnly &&
    lunchAndEvening &&
    currentMinutes >= lunchStart &&
    currentMinutes < lunchEnd
  ) {
    return;
  }

  // =====================================
  // NEXT UNLOCK TIME
  // =====================================

  const nextUnlock =
    !eveningOnly && currentMinutes < lunchStart
      ? CONFIG.lunch.start
      : CONFIG.eveningUnlock;

  // =====================================
  // BLOCK PAGE PARAMETERS
  // =====================================

  // Keep the original parameter names
  // for compatibility with index.html.
  const params = new URLSearchParams({
    site: hostname,

    titulo: CONFIG.messages.title,
    mensagem: CONFIG.messages.description,
    objetivo: CONFIG.messages.goal,
    acao: CONFIG.messages.action,
    rodape: CONFIG.messages.footer,

    liberacao: `Today at ${nextUnlock}`,

    tema: CONFIG.theme === 'light'
      ? 'claro'
      : 'escuro'
  });

  // =====================================
  // HTTPS REDIRECT
  // =====================================

  // Store parameters in the URL fragment (#).
  // Fragments are not sent to the server
  // as part of the HTTP request.
  blockPage.hash = params.toString();

  // Redirect without preserving the
  // blocked page in browser history.
  location.replace(blockPage.href);

})();
