/**
 * UniformERP - app.js
 * Shared across every page. Handles:
 *  1. Registering the service worker (PWA / "Add to Home Screen" support)
 *  2. Dark/light mode toggle (persisted in localStorage, applied instantly on load)
 *  3. A lightweight English/Hindi toggle for shared chrome (nav, header, common buttons/labels)
 *     — page-specific dynamic content (product names, bill data, etc.) stays in English,
 *     since that's real shop data, not interface text.
 */

(function () {
  'use strict';

  // ---------------- Service worker (PWA) ----------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* ignore on unsupported setups */ });
    });
  }

  // ---------------- Dark / light mode ----------------
  function applyDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('uniformerp_dark_mode', isDark ? '1' : '0');
    const btn = document.getElementById('uerp-theme-btn');
    if (btn) btn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  }

  function toggleDarkMode() {
    applyDarkMode(!document.body.classList.contains('dark-mode'));
  }

  // ---------------- Hindi / English toggle ----------------
  var translations = {
    hi: {
      "Dashboard": "डैशबोर्ड",
      "New Bill": "नया बिल",
      "Bill History": "बिल इतिहास",
      "Finance": "वित्त",
      "Inventory": "इन्वेंटरी",
      "Purchase Entry": "खरीद प्रविष्टि",
      "Reports": "रिपोर्ट",
      "Students": "छात्र",
      "Products": "उत्पाद",
      "Schools": "स्कूल",
      "Suppliers": "आपूर्तिकर्ता",
      "Colours/Sizes": "रंग/आकार",
      "User Management": "उपयोगकर्ता प्रबंधन",
      "Audit Logs": "ऑडिट लॉग",
      "Due Reminders": "बकाया अनुस्मारक",
      "Returns & Exchanges": "वापसी और अदला-बदली",
      "Log Out": "लॉग आउट",
      "Log In": "लॉग इन करें",
      "Save": "सहेजें",
      "Add": "जोड़ें",
      "Edit": "संपादित करें",
      "Delete": "हटाएं",
      "Remove": "हटाएं",
      "Deactivate": "निष्क्रिय करें",
      "Activate": "सक्रिय करें",
      "Cancel": "रद्द करें",
      "Cancel Edit": "संपादन रद्द करें",
      "Discard": "छोड़ें",
      "Username": "उपयोगकर्ता नाम",
      "Password": "पासवर्ड",
      "Branch": "शाखा",
      "Status": "स्थिति",
      "Actions": "कार्रवाई",
      "Total Amount": "कुल राशि",
      "Amount Due": "बकाया राशि",
      "Amount Paid": "भुगतान की गई राशि",
      "Search": "खोजें"
    }
  };

  function applyLanguage(lang) {
    var scope = document.querySelectorAll('nav a, header button, .btn-primary, .btn-small, .btn-add, .link-btn, .delete-btn, label, h2, .btn-whatsapp, .link-toggle');
    scope.forEach(function (el) {
      if (el.dataset.uerpOrig === undefined) el.dataset.uerpOrig = el.textContent.trim();
      var orig = el.dataset.uerpOrig;
      if (lang === 'hi' && translations.hi[orig]) {
        el.textContent = translations.hi[orig];
      } else if (orig) {
        el.textContent = orig;
      }
    });
    localStorage.setItem('uniformerp_lang', lang);
    var btn = document.getElementById('uerp-lang-btn');
    if (btn) btn.textContent = lang === 'hi' ? 'EN' : 'हिं';
  }

  function toggleLanguage() {
    var current = localStorage.getItem('uniformerp_lang') || 'en';
    applyLanguage(current === 'hi' ? 'en' : 'hi');
  }

  // ---------------- Floating toolbar ----------------
  function injectToolbar() {
    if (document.getElementById('uerp-toolbar')) return;
    var bar = document.createElement('div');
    bar.id = 'uerp-toolbar';
    bar.innerHTML =
      '<button id="uerp-theme-btn" type="button">🌙 Dark</button>' +
      '<button id="uerp-lang-btn" type="button">हिं</button>';
    document.body.appendChild(bar);
    document.getElementById('uerp-theme-btn').addEventListener('click', toggleDarkMode);
    document.getElementById('uerp-lang-btn').addEventListener('click', toggleLanguage);
  }

  // ---------------- Init on load ----------------
  document.addEventListener('DOMContentLoaded', function () {
    injectToolbar();
    applyDarkMode(localStorage.getItem('uniformerp_dark_mode') === '1');
    applyLanguage(localStorage.getItem('uniformerp_lang') || 'en');
  });
})();
