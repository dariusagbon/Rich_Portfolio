#!/usr/bin/env node
/**
 * ui_audit.mjs — responsive screenshots + automated UI checks for a rendered page.
 *
 * Usage:
 *   node ui_audit.mjs <url-or-html-file> [--out DIR] [--widths 375,768,1440] [--viewport-only] [--dark]
 *
 * Examples:
 *   node ui_audit.mjs http://localhost:3000
 *   node ui_audit.mjs http://localhost:5173/settings --out ./.ui-audit --widths 320,375,1024,1440
 *   node ui_audit.mjs ./index.html --dark
 *
 * Writes one PNG per width to --out (default ./.ui-audit) and prints a report:
 *   - console errors/warnings and failed network requests
 *   - horizontal overflow (and the widest offending elements)
 *   - interactive elements smaller than 44x44 at mobile widths
 *   - images missing alt, controls without an accessible name
 *   - text contrast below WCAG AA on visible text nodes (sampled)
 *
 * Requires Playwright. It is resolved from the current project, then from the global
 * npm root. If neither has it: `npm i -D playwright && npx playwright install chromium`.
 * Set PW_CHROMIUM_PATH to use an existing Chromium binary instead of a downloaded one.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

async function loadPlaywright() {
  const candidates = [path.join(process.cwd(), "package.json")];
  try {
    candidates.push(path.join(execSync("npm root -g", { encoding: "utf8" }).trim(), "noop.js"));
  } catch {}
  for (const base of candidates) {
    const require = createRequire(base);
    for (const name of ["playwright", "@playwright/test", "playwright-core"]) {
      try {
        const mod = await import(pathToFileURL(require.resolve(name)).href);
        return mod.chromium ? mod : mod.default;
      } catch {}
    }
  }
  console.error("Playwright not found. Install with: npm i -D playwright && npx playwright install chromium");
  process.exit(2);
}

function parseArgs(argv) {
  const args = { target: null, out: ".ui-audit", widths: [375, 768, 1440], viewportOnly: false, dark: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") args.out = argv[++i];
    else if (a === "--widths") args.widths = argv[++i].split(",").map(Number).filter(Boolean);
    else if (a === "--viewport-only") args.viewportOnly = true;
    else if (a === "--dark") args.dark = true;
    else if (!args.target) args.target = a;
  }
  if (!args.target) {
    console.error("Usage: node ui_audit.mjs <url-or-html-file> [--out DIR] [--widths 375,768,1440] [--viewport-only] [--dark]");
    process.exit(1);
  }
  if (!/^https?:|^file:/.test(args.target)) args.target = pathToFileURL(path.resolve(args.target)).href;
  return args;
}

// Runs inside the page. Returns findings for the current viewport.
function auditPage(isMobile) {
  const vw = document.documentElement.clientWidth;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && s.opacity !== "0";
  };
  const describe = (el) => {
    let d = el.tagName.toLowerCase();
    if (el.id) d += `#${el.id}`;
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
    if (cls) d += `.${cls}`;
    const text = (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40);
    return text ? `${d} "${text}"` : d;
  };

  const overflow = [];
  if (document.documentElement.scrollWidth > vw + 1) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0 && visible(el)) overflow.push({ el: describe(el), right: Math.round(r.right) });
    }
    overflow.sort((a, b) => b.right - a.right);
  }

  const interactiveSel = "a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], [role=menuitem], [tabindex]:not([tabindex='-1'])";
  const smallTargets = [];
  const unnamed = [];
  for (const el of document.querySelectorAll(interactiveSel)) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    const inlineLink = el.tagName === "A" && getComputedStyle(el).display === "inline";
    if (isMobile && !inlineLink && (r.width < 44 || r.height < 44)) {
      smallTargets.push(`${describe(el)} (${Math.round(r.width)}x${Math.round(r.height)})`);
    }
    const labelledBy = el.getAttribute("aria-labelledby");
    const name =
      el.getAttribute("aria-label") ||
      (labelledBy && labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.innerText || "").join(" ").trim()) ||
      (el.labels && [...el.labels].map((l) => l.innerText).join(" ").trim()) ||
      el.getAttribute("title") ||
      (el.tagName === "INPUT" && ["submit", "button", "reset"].includes(el.type) && el.value) ||
      el.innerText?.trim() ||
      el.querySelector("img[alt]:not([alt=''])")?.alt ||
      el.querySelector("svg title")?.textContent;
    if (!name) unnamed.push(describe(el));
  }

  const missingAlt = [...document.querySelectorAll("img:not([alt])")].filter(visible).map((img) => img.currentSrc || img.src);

  // Contrast: sample visible elements that directly contain text.
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== "none") return null; // gradients/images: can't judge reliably
      const c = parse(s.backgroundColor);
      if (c && c.a >= 0.99) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const lowContrast = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("body *")) {
    if (lowContrast.length >= 15) break;
    if (!visible(el)) continue;
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    const s = getComputedStyle(el);
    const fg = parse(s.color);
    const bg = bgOf(el);
    if (!fg || !bg || fg.a < 0.99) continue;
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(s.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
    const min = large ? 3 : 4.5;
    const key = `${s.color}|${bg.r},${bg.g},${bg.b}|${large}`;
    if (ratio < min && !seen.has(key)) {
      seen.add(key);
      lowContrast.push(`${describe(el)} — ${ratio.toFixed(2)}:1 (needs ${min}:1)`);
    }
  }

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(visible).map((h) => h.tagName);
  return {
    scrollWidth: document.documentElement.scrollWidth,
    viewport: vw,
    overflow: overflow.slice(0, 8),
    smallTargets: smallTargets.slice(0, 15),
    smallTargetsTotal: smallTargets.length,
    unnamed: unnamed.slice(0, 15),
    missingAlt: missingAlt.slice(0, 15),
    lowContrast,
    h1Count: headings.filter((h) => h === "H1").length,
    hasMain: !!document.querySelector("main, [role=main]"),
  };
}

const args = parseArgs(process.argv.slice(2));
const { chromium } = await loadPlaywright();
fs.mkdirSync(args.out, { recursive: true });

const launchOpts = {};
if (process.env.PW_CHROMIUM_PATH) launchOpts.executablePath = process.env.PW_CHROMIUM_PATH;
const browser = await chromium.launch(launchOpts);

const issues = { console: [], requests: [] };
let total = 0;
for (const width of args.widths) {
  const isMobile = width < 640;
  const context = await browser.newContext({
    viewport: { width, height: isMobile ? 812 : 900 },
    deviceScaleFactor: isMobile ? 2 : 1,
    hasTouch: isMobile,
    colorScheme: args.dark ? "dark" : "light",
  });
  const page = await context.newPage();
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) issues.console.push(`[${width}px ${m.type()}] ${m.text().slice(0, 300)}`);
  });
  page.on("pageerror", (e) => issues.console.push(`[${width}px pageerror] ${e.message.slice(0, 300)}`));
  page.on("requestfailed", (r) => issues.requests.push(`[${width}px] ${r.url()} — ${r.failure()?.errorText}`));
  page.on("response", (r) => {
    if (r.status() >= 400) issues.requests.push(`[${width}px] ${r.status()} ${r.url()}`);
  });

  try {
    await page.goto(args.target, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    await page.goto(args.target, { waitUntil: "load", timeout: 30000 }).catch(() => {});
    issues.console.push(`[${width}px] navigation: ${e.message.split("\n")[0]}`);
  }
  await page.waitForTimeout(400);

  const file = path.join(args.out, `${width}${args.dark ? "-dark" : ""}.png`);
  await page.screenshot({ path: file, fullPage: !args.viewportOnly });
  const r = await page.evaluate(auditPage, isMobile);

  console.log(`\n=== ${width}px  →  ${file}`);
  if (r.scrollWidth > r.viewport + 1) {
    total++;
    console.log(`✗ Horizontal overflow: page is ${r.scrollWidth}px wide in a ${r.viewport}px viewport`);
    r.overflow.forEach((o) => console.log(`    ${o.el} (right edge ${o.right}px)`));
  } else console.log("✓ No horizontal overflow");
  if (isMobile && r.smallTargetsTotal) {
    total++;
    console.log(`✗ ${r.smallTargetsTotal} touch target(s) under 44x44px:`);
    r.smallTargets.forEach((s) => console.log(`    ${s}`));
  }
  if (width === args.widths[0]) {
    if (r.unnamed.length) { total++; console.log("✗ Controls without an accessible name:"); r.unnamed.forEach((s) => console.log(`    ${s}`)); }
    if (r.missingAlt.length) { total++; console.log("✗ Images missing alt:"); r.missingAlt.forEach((s) => console.log(`    ${s}`)); }
    if (r.lowContrast.length) { total++; console.log("✗ Low text contrast (sampled):"); r.lowContrast.forEach((s) => console.log(`    ${s}`)); }
    if (r.h1Count !== 1) console.log(`! ${r.h1Count} visible <h1> elements (expected 1)`);
    if (!r.hasMain) console.log("! No <main> landmark");
  }
  await context.close();
}
await browser.close();

const uniq = (a) => [...new Set(a)];
if (issues.console.length) { total++; console.log("\n✗ Console errors/warnings:"); uniq(issues.console).slice(0, 20).forEach((s) => console.log(`    ${s}`)); }
if (issues.requests.length) { total++; console.log("\n✗ Failed requests:"); uniq(issues.requests).slice(0, 20).forEach((s) => console.log(`    ${s}`)); }
console.log(`\n${total ? `${total} issue group(s) found` : "No automated issues found"}. Now view the screenshots — automated checks don't judge hierarchy, spacing, or polish.`);
