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
  console.log('[UniformERP] app.js loaded and running on:', window.location.pathname);

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
      // Navigation
      "Dashboard": "डैशबोर्ड", "New Bill": "नया बिल", "Bill History": "बिल इतिहास",
      "Finance": "वित्त", "Inventory": "इन्वेंटरी", "Purchase Entry": "खरीद प्रविष्टि",
      "Reports": "रिपोर्ट", "Students": "छात्र", "Products": "उत्पाद", "Schools": "स्कूल",
      "Suppliers": "आपूर्तिकर्ता", "Colours/Sizes": "रंग/आकार", "User Management": "उपयोगकर्ता प्रबंधन",
      "Audit Logs": "ऑडिट लॉग", "Due Reminders": "बकाया अनुस्मारक", "Returns & Exchanges": "वापसी और अदला-बदली",

      // Section headings
      "1. Find Student": "1. छात्र खोजें", "1. Find the Original Bill": "1. मूल बिल खोजें",
      "2. Add Items": "2. वस्तुएं जोड़ें", "2. Select Item to Return": "2. वापसी हेतु वस्तु चुनें",
      "3. Process Return / Exchange": "3. वापसी/अदला-बदली करें",
      "Add New User": "नया उपयोगकर्ता जोड़ें", "Add Product": "उत्पाद जोड़ें", "Add School": "स्कूल जोड़ें",
      "Add Student": "छात्र जोड़ें", "Add Supplier": "आपूर्तिकर्ता जोड़ें",
      "All Products": "सभी उत्पाद", "All Schools": "सभी स्कूल", "All Students": "सभी छात्र",
      "All Suppliers": "सभी आपूर्तिकर्ता", "All Users": "सभी उपयोगकर्ता",
      "Cart": "कार्ट", "Check & Confirm Before Saving": "सहेजने से पहले जांचें और पुष्टि करें",
      "Colours": "रंग", "Current Stock": "वर्तमान स्टॉक", "Daily Closing Summary": "दैनिक समापन सारांश",
      "Message Template": "संदेश टेम्पलेट", "No academic sessions yet? Add one quickly": "अभी तक कोई सत्र नहीं? जल्दी जोड़ें",
      "Outstanding Dues": "बकाया राशि", "Recent Activity (latest 200 actions)": "हाल की गतिविधि (नवीनतम 200)",
      "Recent Bills": "हाल के बिल", "Recent Purchases": "हाल की खरीद", "Recent Returns & Exchanges": "हाल की वापसी/अदला-बदली",
      "Record New Purchase": "नई खरीद दर्ज करें", "Sales — Last 7 Days": "बिक्री — पिछले 7 दिन",
      "Scan Purchase Bill (AI)": "खरीद बिल स्कैन करें (AI)", "Sizes": "आकार",

      // Field labels
      "Academic Session": "शैक्षणिक सत्र", "Address": "पता", "Admission No.": "प्रवेश संख्या",
      "Amount Paid Now": "अभी भुगतान राशि", "Amount Paid Now (if extra owed)": "अभी भुगतान राशि (यदि अतिरिक्त बकाया)",
      "Amount Received": "प्राप्त राशि", "Branch": "शाखा", "Category": "श्रेणी", "Class": "कक्षा",
      "Clear Due Before": "इस तिथि से पहले चुकाएं", "Colour": "रंग", "Contact Person": "संपर्क व्यक्ति",
      "Cost Price (per unit)": "लागत मूल्य (प्रति इकाई)", "Date": "तारीख", "End Date": "समाप्ति तिथि",
      "From": "से", "Full Name": "पूरा नाम", "Parent WhatsApp Number": "अभिभावक का व्हाट्सएप नंबर",
      "Password": "पासवर्ड", "Payment Mode": "भुगतान का तरीका", "Phone": "फोन",
      "Price per Unit": "प्रति इकाई मूल्य", "Price ₹": "मूल्य ₹", "Product": "उत्पाद",
      "Product Name": "उत्पाद का नाम", "Purchase Date": "खरीद तिथि", "Qty": "मात्रा",
      "Quantity": "मात्रा", "Quantity to Return": "वापसी मात्रा", "Reason (optional)": "कारण (वैकल्पिक)",
      "Role": "भूमिका", "School": "स्कूल", "School Name": "स्कूल का नाम", "Section": "सेक्शन",
      "Selling Price (per unit)": "विक्रय मूल्य (प्रति इकाई)", "Session Name (e.g. 2026-27)": "सत्र नाम (जैसे 2026-27)",
      "Size": "आकार", "Start Date": "प्रारंभ तिथि", "Student Name": "छात्र का नाम", "Supplier": "आपूर्तिकर्ता",
      "Supplier Name": "आपूर्तिकर्ता का नाम", "To": "तक", "Unit": "इकाई", "Username": "उपयोगकर्ता नाम",

      // Buttons
      "Add": "जोड़ें", "Add Session": "सत्र जोड़ें", "Apply Filter": "फ़िल्टर लागू करें",
      "Cancel": "रद्द करें", "Cancel Edit": "संपादन रद्द करें", "Change": "बदलें",
      "Collect": "वसूल करें", "Confirm": "पुष्टि करें", "Confirm Return": "वापसी की पुष्टि करें",
      "Create User": "उपयोगकर्ता बनाएं", "Delete": "हटाएं", "Discard": "छोड़ें", "Edit": "संपादित करें",
      "Exchange for Another Item": "अन्य वस्तु से बदलें", "Exit Queue": "कतार से बाहर निकलें",
      "Generate Bill": "बिल बनाएं", "History": "इतिहास", "Log In": "लॉग इन करें", "Log Out": "लॉग आउट",
      "Product-wise": "उत्पाद-वार", "Profit": "लाभ", "Refresh": "ताज़ा करें", "Refund Only": "केवल रिफंड",
      "Remove": "हटाएं", "Reset Password": "पासवर्ड रीसेट करें", "Reset to Default": "डिफ़ॉल्ट पर रीसेट करें",
      "Sales Summary": "बिक्री सारांश", "Save All Purchases": "सभी खरीद सहेजें", "Save Changes": "परिवर्तन सहेजें",
      "Save Product": "उत्पाद सहेजें", "Save Purchase": "खरीद सहेजें", "Save School": "स्कूल सहेजें",
      "Save Student": "छात्र सहेजें", "Save Supplier": "आपूर्तिकर्ता सहेजें", "Save Template": "टेम्पलेट सहेजें",
      "School-wise": "स्कूल-वार", "Select": "चुनें", "Send Reminder": "अनुस्मारक भेजें",
      "Send on WhatsApp": "व्हाट्सएप पर भेजें", "Skip": "छोड़ें", "Staff-wise": "स्टाफ-वार",
      "View / Print": "देखें / प्रिंट करें", "Deactivate": "निष्क्रिय करें", "Activate": "सक्रिय करें",
      "Save": "सहेजें",

      // Table headers
      "Action": "कार्रवाई", "Actions": "कार्रवाई", "Adm. No.": "प्रवेश संख्या", "Already Returned": "पहले से वापस",
      "Amount": "राशि", "Bill No": "बिल नंबर", "Bills": "बिल", "Bills Due": "बकाया बिल",
      "Buying Price": "क्रय मूल्य", "Cash Given": "नकद दिया गया", "Collected": "एकत्रित",
      "Contact": "संपर्क", "Cost/Unit": "लागत/इकाई", "Details": "विवरण", "Due": "बकाया",
      "Item": "वस्तु", "Name": "नाम", "Paid": "भुगतान किया", "Price": "मूल्य", "Rate": "दर",
      "Record": "रिकॉर्ड", "Refund": "रिफंड", "Remaining": "शेष", "Returnable": "वापसी योग्य",
      "Revenue": "राजस्व", "Sales": "बिक्री", "Sec": "सेक्शन", "Selling Price": "विक्रय मूल्य",
      "Selling/Unit": "विक्रय/इकाई", "Session": "सत्र", "Staff": "स्टाफ", "Status": "स्थिति",
      "Stock": "स्टॉक", "Stock Value (Cost)": "स्टॉक मूल्य (लागत)", "Student": "छात्र",
      "Time": "समय", "Total": "कुल", "Total Cost": "कुल लागत", "Total Due": "कुल बकाया",
      "Type": "प्रकार", "Unit Price": "इकाई मूल्य", "Units Sold": "बेची गई इकाइयां", "User": "उपयोगकर्ता",
      "WhatsApp": "व्हाट्सएप", "Total Amount": "कुल राशि", "Amount Due": "बकाया राशि", "Amount Paid": "भुगतान की गई राशि",

      // Placeholders
      "Search": "खोजें",
      "Search by admission no. or name...": "प्रवेश संख्या या नाम से खोजें...",
      "Search by bill no, student name, or admission no...": "बिल नंबर, छात्र नाम, या प्रवेश संख्या से खोजें...",
      "Search by name or admission no...": "नाम या प्रवेश संख्या से खोजें...",
      "Search by student name, admission no. or bill no...": "छात्र नाम, प्रवेश संख्या या बिल नंबर से खोजें...",
      "Search product name...": "उत्पाद नाम खोजें...",
      "Filter by action type (e.g. Login, Add Product)...": "कार्रवाई प्रकार से फ़िल्टर करें...",
      "min. 6 characters": "न्यूनतम 6 अक्षर",

      // Dropdown options
      "-- Select --": "-- चुनें --", "-- Select School --": "-- स्कूल चुनें --",
      "All Branches": "सभी शाखाएं", "Both": "दोनों", "Card": "कार्ड", "Cash": "नकद",
      "Owner": "मालिक", "Staff": "स्टाफ", "UPI": "यूपीआई"
    }
  };

  function applyLanguage(lang) {
    // Static text elements (headings, buttons, labels, table headers)
    var scope = document.querySelectorAll(
      'nav a, header button, button, .btn-primary, .btn-small, .btn-add, .link-btn, .delete-btn, ' +
      'label, h2, h3, th, .btn-whatsapp, .link-toggle, .uerp-menu-toggle'
    );
    scope.forEach(function (el) {
      // Skip elements whose content is dynamically generated data (has child elements beyond plain text)
      if (el.children.length > 0 && el.tagName !== 'BUTTON') return;
      // The dark-mode toggle button's text is stateful (🌙 Dark / ☀️ Light) and managed separately — never touch it here
      if (el.id === 'uerp-theme-btn') return;
      // The "Add New Student" toggle on Billing also swaps its own text based on open/closed state
      if (el.id === 'addStudentToggleBtn') return;
      if (el.dataset.uerpOrig === undefined) el.dataset.uerpOrig = el.textContent.trim();
      var orig = el.dataset.uerpOrig;
      if (lang === 'hi' && translations.hi[orig]) {
        el.textContent = translations.hi[orig];
      } else if (orig) {
        el.textContent = orig;
      }
    });

    // Placeholder attributes
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function (el) {
      if (el.dataset.uerpOrigPlaceholder === undefined) el.dataset.uerpOrigPlaceholder = el.getAttribute('placeholder');
      var orig = el.dataset.uerpOrigPlaceholder;
      if (lang === 'hi' && translations.hi[orig]) {
        el.setAttribute('placeholder', translations.hi[orig]);
      } else {
        el.setAttribute('placeholder', orig);
      }
    });

    // Dropdown <option> static text (skip options that look like dynamically-populated data)
    document.querySelectorAll('option').forEach(function (el) {
      if (el.dataset.uerpOrig === undefined) el.dataset.uerpOrig = el.textContent.trim();
      var orig = el.dataset.uerpOrig;
      if (lang === 'hi' && translations.hi[orig]) {
        el.textContent = translations.hi[orig];
      } else if (orig && translations.hi[orig]) {
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

  // ---------------- Header toolbar buttons ----------------
  function injectToolbar() {
    try {
      if (document.getElementById('uerp-theme-btn')) {
        console.log('[UniformERP] Toolbar already present, skipping.');
        return;
      }
      var heading = document.querySelector('header h1') || document.querySelector('h1');
      if (!heading) {
        console.error('[UniformERP] injectToolbar FAILED: no <h1> found on this page at all.');
        return;
      }
      console.log('[UniformERP] Found heading:', heading.textContent);

      var titleWrapper = document.createElement('div');
      titleWrapper.style.display = 'flex';
      titleWrapper.style.alignItems = 'center';
      titleWrapper.style.flexWrap = 'wrap';
      titleWrapper.style.gap = '10px';
      heading.parentNode.insertBefore(titleWrapper, heading);
      titleWrapper.appendChild(heading);

      var wrapper = document.createElement('span');
      wrapper.id = 'uerp-toolbar';
      wrapper.style.display = 'flex';
      wrapper.style.gap = '6px';

      var langBtn = document.createElement('button');
      langBtn.id = 'uerp-lang-btn';
      langBtn.type = 'button';
      langBtn.textContent = 'हिं';

      var themeBtn = document.createElement('button');
      themeBtn.id = 'uerp-theme-btn';
      themeBtn.type = 'button';
      themeBtn.textContent = '🌙 Dark';

      wrapper.appendChild(themeBtn);
      wrapper.appendChild(langBtn);
      titleWrapper.appendChild(wrapper);

      themeBtn.addEventListener('click', toggleDarkMode);
      langBtn.addEventListener('click', toggleLanguage);
      console.log('[UniformERP] Toolbar injected successfully.', document.getElementById('uerp-theme-btn'));
    } catch (err) {
      console.error('[UniformERP] injectToolbar THREW AN ERROR:', err);
    }
  }

  // ---------------- Mobile hamburger menu ----------------
  function injectMobileNavToggle() {
    document.querySelectorAll('nav').forEach(function (navEl) {
      if (navEl.dataset.uerpToggled) return;
      navEl.dataset.uerpToggled = '1';
      var toggleBtn = document.createElement('button');
      toggleBtn.className = 'uerp-menu-toggle';
      toggleBtn.type = 'button';
      toggleBtn.textContent = '☰ Menu';
      navEl.parentNode.insertBefore(toggleBtn, navEl);
      toggleBtn.addEventListener('click', function () {
        navEl.classList.toggle('uerp-nav-open');
      });
    });
  }

  // ---------------- Init on load ----------------
  function runInit() {
    console.log('[UniformERP] Running init...');
    try {
      injectToolbar();
      injectMobileNavToggle();
      applyDarkMode(localStorage.getItem('uniformerp_dark_mode') === '1');
      applyLanguage(localStorage.getItem('uniformerp_lang') || 'en');
      console.log('[UniformERP] Init complete.');
    } catch (err) {
      console.error('[UniformERP] Init FAILED:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    // DOMContentLoaded already fired before this script ran — init immediately instead of waiting forever
    console.log('[UniformERP] Document already ready, running init immediately.');
    runInit();
  }
})();
