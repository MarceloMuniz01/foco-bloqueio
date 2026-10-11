// ==UserScript==
// @name         Foco Bloqueio - Website Blocker
// @namespace    foco.via
// @version      3.0.0
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
    blockPageUrl: 'https://YOUR_USER.github.io/foco-bloqueio/',
    theme: 'dark', // 'dark' or 'light'

    messages: {
      title: 'You chose to protect your time.',
      message: 'Entertainment can wait. Focus on what you want to build.',
      goal: 'Build a successful career and achieve financial independence.',
      action: 'Start with one small task and make progress on your goals.',
      footer: 'Discipline today. Freedom tomorrow.'
    },

    // Access windows use [start, end), in local 24-hour time.
    // 24:00 means the end of the day.
    windows: {
      lunch: ['12:00', '13:00'],
      evening: ['17:30', '24:00']
    },

    // First matching group wins: put restrictive groups first.
    groups: [
      {
        sites: ['*anything*'],
        access: ['evening']
      },
      {
        sites: [
          '*.youtube.com',
          'youtu.be',
          '*.instagram.com',
          '*.tiktok.com'
        ],
        access: ['lunch', 'evening']
      }
    ]
  };

  // =====================================
  // SETUP
  // =====================================

  if (window.top !== window.self) return;

  if (CONFIG.blockPageUrl.includes('YOUR_USER')) {
    console.warn('[Foco Bloqueio] Set your blockPageUrl before using the script.');
    return;
  }

  let blockPage;

  try {
    blockPage = new URL(CONFIG.blockPageUrl);
    if (blockPage.protocol !== 'https:') throw new Error('HTTPS is required.');
  } catch (error) {
    console.error('[Foco Bloqueio] Invalid blockPageUrl:', error);
    return;
  }

  // Avoid redirecting the block page to itself.
  if (location.origin === blockPage.origin) return;

  const hostname = location.hostname.toLowerCase().replace(/\.$/, '');

  // =====================================
  // DOMAIN MATCHING
  // =====================================

  function matchesPattern(domain, pattern) {
    const value = String(pattern).trim().toLowerCase();
    if (!value) return false;

    // *.example.com matches both the root domain and subdomains.
    if (value.startsWith('*.') && domain === value.slice(2)) return true;

    const escaped = value
      .split('*')
      .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*');

    return new RegExp(`^${escaped}$`, 'i').test(domain);
  }

  const group = CONFIG.groups.find(({ sites }) =>
    sites.some(pattern => matchesPattern(hostname, pattern))
  );

  if (!group) return;

  // =====================================
  // TIME WINDOWS
  // =====================================

  function toMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function formatTime(value) {
    const hours = String(Math.floor(value / 60)).padStart(2, '0');
    const minutes = String(value % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const windows = group.access
    .map(name => CONFIG.windows[name])
    .filter(Boolean)
    .map(([start, end]) => [toMinutes(start), toMinutes(end)]);

  if (!windows.length) return;

  const isAllowed = windows.some(([start, end]) =>
    currentTime >= start && currentTime < end
  );

  if (isAllowed) return;

  const starts = windows.map(([start]) => start).sort((a, b) => a - b);
  const upcoming = starts.find(start => start > currentTime);
  const nextUnlock = upcoming ?? starts[0];
  const day = upcoming === undefined ? 'Tomorrow' : 'Today';

  // =====================================
  // HTTPS REDIRECT
  // =====================================

  const params = new URLSearchParams({
    site: hostname,
    ...CONFIG.messages,
    unlock: `${day} at ${formatTime(nextUnlock)}`,
    theme: CONFIG.theme
  });

  // The fragment is not included in the HTTP request.
  blockPage.hash = params.toString();
  location.replace(blockPage.href);
})();
