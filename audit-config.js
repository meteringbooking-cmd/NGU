// ============================================================================
//  COMPLIANCE AUDIT PLATFORM – SETTINGS
//  This is the only file a company needs to edit to set the platform up.
// ============================================================================

// ---- 1. Name, logo and colour shown on every page --------------------------
export const BRAND = {
  appName: 'Compliance Audits',   // shown top-left and in the browser tab
  companyName: '',                // optional, shown under the app name, e.g. 'Acme Metering Ltd'
  logoUrl: '',                    // optional, link to a logo image (square or wide, max ~40px tall)
  accentColor: '#2563eb'          // main button / highlight colour (hex)
};

// ---- 2. Firebase project the platform saves to ----------------------------
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCMmUOdW2uEIGVd6XQfWXKF8eaFmwEog1g",
  authDomain: "oesperformance-a54c0.firebaseapp.com",
  projectId: "oesperformance-a54c0",
  storageBucket: "oesperformance-a54c0.firebasestorage.app",
  messagingSenderId: "484894102454",
  appId: "1:484894102454:web:17535ee497eac2d90d6717"
};

// ---- 3. Starting lists (only used until the Lists page has been saved) ----
//  Leave an array empty [] to start with a blank list.
export const DEFAULT_LISTS = {
  engineers: ["Aaron Shepherd","Adam Williams","Alessandro Cilia","Alex Duff","Ali Cavan","Allan Grant","Andrew Wallace","Authur Bumhira","Bilal Amin","Billy McDonough","Bryan McCabe","Calum Ballingal","Chanda Kasama","Chris Stein","Chris Timm","Clayton Spink","Craig O'Sullivan","Craig Steel","Daniel Leahy","Daniel Nally","Daniel Sanders","David Flint","David Williams","David Wilson","Dinis Cruz","Duncan Cairncross","Geoff Pymm","George Chapman","Hamza Safwan","Harris Saleem","Herve Ntwali","Ian Dobson","Ivan Rivers","James Fox","James Mclean","James Stott","Jamie Longland","Jon Convery","Jonathan Chyla","Jonny Thompson","Jordan Gray","Jordan Morrison","Kris Armstrong","Lee Parkin","Lee Robinson","Logan Baff","Lukasz Holysz","Mark Lavelle","Martin Bailes","Matti Chalkowski","Medhi Khamseh","Michael Douglass","Michael Seaman","Michael Timm","Morris Dow","Muhammad Shahroze","Muhammad Zafar","Neil Burns","Neil Lockwood","Nick Griffiths","Owain Sigsworth","Paul Davidson","Paul Day","Pedro Magalhaes","Richard Lang","Ryan Beekawa","Ryan Clark","Sammim Miah","Samuel Appiah","Scott Coyle","Simon Morris","Stephen Lawless","Stuart Shaw","Syed Ali","Thomas Green","Tomas Anderson","Zafar Mahmood"],
  contracts: ["SESM - OES","SESM - SP","SESM - EDF","Energise","IMSERV"],
  lineManagers: ["Stuart Whyte","Scott Carson","Thomas Green","Richard Wiecko"],
  auditors: ["Ricky Johnson","Thomas Green","Scott Carson","Stuart Whyte","Darren Cook","Richard Wiecko","Phil Banks"]
};

// ============================================================================
//  Nothing below needs changing.
// ============================================================================
export const NAV = [
  { href: 'auditing-homepage.html', label: 'Home' },
  { href: 'audit-selection.html',   label: 'New Audit' },
  { href: 'audit-review.html',      label: 'Audit Review' },
  { href: 'question-review.html',   label: 'Questions' },
  { href: 'addname.html',           label: 'Lists' }
];

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return null;
  let h = m[1]; if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Fills in the page header, browser-tab title and accent colour from BRAND.
export function applyBranding(pageTitle) {
  document.title = pageTitle ? `${pageTitle} · ${BRAND.appName}` : BRAND.appName;
  document.querySelectorAll('[data-brand="appName"]').forEach(el => el.textContent = BRAND.appName);
  document.querySelectorAll('[data-brand="companyName"]').forEach(el => { el.textContent = BRAND.companyName || ''; el.hidden = !BRAND.companyName; });
  if (BRAND.logoUrl) document.querySelectorAll('.brand-mark').forEach(el => {
    const img = document.createElement('img'); img.src = BRAND.logoUrl; img.alt = ''; img.className = 'brand-logo'; el.replaceWith(img);
  });
  const rgb = hexToRgb(BRAND.accentColor);
  if (rgb) {
    const r = document.documentElement.style;
    r.setProperty('--accent', BRAND.accentColor);
    r.setProperty('--accent-rgb', rgb.join(','));
    r.setProperty('--primary', `rgb(${rgb.map(v => Math.round(v * 0.82)).join(',')})`);
  }
}
