#!/usr/bin/env node
/**
 * Accessibility and responsive audit (CPMB-16).
 *
 * Walks every page of the site in a real browser, at the three checkpoints
 * the epic names, and reports what a machine can see: axe-core violations
 * (contrast, names, roles, touch targets), horizontal scrolling, the heading
 * outline, and whether `prefers-reduced-motion` actually stops the
 * animations. What it cannot judge — is that alt text true, does the reading
 * order make sense — stays a human's job; `docs/RECETTE-A11Y.md` records
 * both halves.
 *
 * Usage:
 *   yarn build && yarn start &      # or any server on AUDIT_URL
 *   yarn audit:a11y
 *
 * Environment:
 *   AUDIT_URL       base address to audit (default http://127.0.0.1:3000)
 *   CHROMIUM_PATH   browser binary, when Playwright's own is not installed
 *   AUDIT_JSON      path to write the full report to, as JSON
 */

import { readFileSync, writeFileSync } from "node:fs";
import { argv, env, exit } from "node:process";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE_URL = env.AUDIT_URL ?? "http://127.0.0.1:3000";

/**
 * "networkidle" never settles — Next holds a connection open for its router
 * — so a page is read once "load" has fired and the fonts have arrived:
 * contrast is then measured against the real typeface, not the fallback.
 */
const SETTLE_MS = 300;
const NAVIGATION_TIMEOUT_MS = 45_000;

/**
 * Serve every photo from `public/` instead of through `/_next/image`.
 *
 * Walking ten pages at four widths asks the optimiser for hundreds of
 * variants, and a navigation that leaves while some are still being resized
 * eventually starves it: the HTML keeps answering in milliseconds while the
 * images hang forever. The audit reads layout, contrast and names — the same
 * file at its native size shows all three.
 */
const serveOriginalImages = (page) =>
  page.route("**/_next/image**", (route) => {
    const source = new URL(route.request().url()).searchParams.get("url");

    return source?.startsWith("/") ? route.continue({ url: `${BASE_URL}${source}` }) : route.continue();
  });

const open = async (page, path) => {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "load", timeout: NAVIGATION_TIMEOUT_MS });

  /* Contrast is measured against the real typeface, not the fallback. */
  await page.evaluate(() => document.fonts.ready);

  /*
   * And against the settled page: the hero fades its content in, and text
   * read mid-fade is half transparent — axe then measures it against what
   * shows through and reports a contrast the visitor never sees. Infinite
   * animations, the header's equaliser, are left running.
   */
  await page.evaluate(async () => {
    const running = document
      .getAnimations()
      .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity);

    await Promise.all(running.map((animation) => animation.finished.catch(() => {})));
  });

  await page.waitForTimeout(SETTLE_MS);
};

const json = (file) => JSON.parse(readFileSync(new URL(`../assets/contents/${file}`, import.meta.url), "utf8"));

const concerts = json("concerts.json");
const articles = json("articles.json");

/** One page of each kind, plus the two the visitor reaches by accident. */
const ROUTES = [
  { path: "/", name: "Accueil" },
  { path: "/presentation", name: "Présentation" },
  { path: "/presentation/benoit-dubu", name: "Fiche artiste" },
  { path: "/nos-concerts", name: "Nos concerts" },
  { path: `/nos-concerts/${concerts[0].slug}`, name: "Fiche concert" },
  { path: "/presse", name: "Presse" },
  { path: `/presse/${articles[0].slug}`, name: "Article de presse" },
  { path: "/contact", name: "Contact" },
  { path: "/mentions-legales", name: "Mentions légales" },
  { path: "/cette-page-nexiste-pas", name: "Page non trouvée" },
];

/** The epic's checkpoints, plus the desktop one seen at 200 % zoom. */
const VIEWPORTS = [
  { name: "390 px", width: 390, height: 844 },
  { name: "768 px", width: 768, height: 1024 },
  { name: "1440 px", width: 1440, height: 900 },
  { name: "1440 px à 200 %", width: 720, height: 450 },
];

/**
 * WCAG 2.0/2.1/2.2 up to AA — the level the epic asks for. `best-practice`
 * adds the heading outline and the landmark rules, which is exactly what the
 * ticket lists under "hiérarchie des titres".
 */
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

/** An anomaly at these levels blocks the release. */
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

const findings = [];

/** Page titles, checked against each other once every page is walked. */
const titles = [];

const record = (finding) => {
  findings.push(finding);
  const mark = finding.blocking ? "✖" : "•";
  console.log(`  ${mark} [${finding.rule}] ${finding.detail}`);
};

/** Does the page scroll sideways? The epic forbids it at every width. */
const horizontalOverflow = (page) =>
  page.evaluate(() => {
    const doc = document.documentElement;
    /* One pixel of tolerance: a sub-pixel layout rounds up. */
    if (doc.scrollWidth <= window.innerWidth + 1) return null;

    const guilty = [...document.querySelectorAll("body *")]
      .filter((node) => node.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 3)
      .map((node) => `${node.tagName.toLowerCase()}.${[...node.classList].slice(0, 3).join(".")}`);

    return { scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth, guilty };
  });

/** Exactly one `h1`, and no level skipped on the way down. */
const headingOutline = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((node) => ({
      level: Number(node.tagName.slice(1)),
      text: (node.textContent ?? "").trim().slice(0, 60),
    }))
  );

/** Animations still running once the visitor has asked for fewer of them. */
const runningAnimations = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((node) => {
        const { animationName, animationDuration } = getComputedStyle(node);
        return animationName !== "none" && animationDuration !== "0s";
      })
      .map((node) => `${node.tagName.toLowerCase()} (${getComputedStyle(node).animationName})`)
      .slice(0, 5)
  );

const auditViewport = async (page, route, viewport) => {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await open(page, route.path);

  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();

  results.violations.forEach((violation) => {
    record({
      route: route.path,
      viewport: viewport.name,
      rule: violation.id,
      impact: violation.impact,
      blocking: BLOCKING_IMPACTS.has(violation.impact),
      detail: `${violation.help} (${violation.nodes.length}) — ${violation.nodes[0]?.target?.join(" ") ?? ""}`,
    });
  });

  const overflow = await horizontalOverflow(page);
  if (overflow) {
    record({
      route: route.path,
      viewport: viewport.name,
      rule: "defilement-horizontal",
      impact: "serious",
      blocking: true,
      detail: `${overflow.scrollWidth}px de contenu pour ${overflow.innerWidth}px de fenêtre — ${overflow.guilty.join(", ")}`,
    });
  }
};

const auditOutline = async (page, route) => {
  const headings = await headingOutline(page);
  const h1 = headings.filter((heading) => heading.level === 1);

  if (h1.length !== 1) {
    record({
      route: route.path,
      viewport: "—",
      rule: "un-seul-h1",
      impact: "serious",
      blocking: true,
      detail: `${h1.length} h1 sur la page`,
    });
  }

  headings.slice(1).forEach((heading, index) => {
    const previous = headings[index];
    if (heading.level > previous.level + 1) {
      record({
        route: route.path,
        viewport: "—",
        rule: "niveau-de-titre-saute",
        impact: "moderate",
        blocking: false,
        detail: `h${previous.level} « ${previous.text} » puis h${heading.level} « ${heading.text} »`,
      });
    }
  });
};

/**
 * Enough stops to walk the longest page to its end — the agenda carries
 * around sixty. The sweep is only conclusive once it has left the page, so
 * the budget has to exceed the page, not sample it.
 */
const KEYBOARD_STEPS = 200;

/** State of whatever the Tab key has just reached. */
const focusState = (page) =>
  page.evaluate(() => {
    const node = document.activeElement;
    if (!node || node === document.body) return { outside: true };

    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();

    return {
      outside: false,
      /* Identity of the element, to tell a second visit from a namesake. */
      key: [...document.querySelectorAll("*")].indexOf(node),
      name: `${node.tagName.toLowerCase()} « ${(node.getAttribute("aria-label") ?? node.textContent ?? "").trim().slice(0, 40)} »`,
      /* A control with no box cannot show where the focus is. */
      invisible: box.width === 0 && box.height === 0,
      /* The browser's own ring counts: the site declares no other. */
      ringed:
        (style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0) || style.boxShadow !== "none",
      inDialog: Boolean(node.closest('[role="dialog"]')),
    };
  });

/**
 * Walks the page with the Tab key: every stop must be a control that is
 * visible and shows the focus, and the walk must reach the end of the page.
 *
 * Past its last control, the browser hands the focus back to the document —
 * that is how a free page ends, and the only way this sweep ends well.
 * Landing twice on the same element before that means the focus is going
 * round a closed circuit: one control that keeps itself, or a widget cycling
 * through several, which reads the same to someone holding Tab.
 */
const auditKeyboard = async (page, route, viewport) => {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await open(page, route.path);

  const visited = [];
  let escaped = false;

  for (let step = 0; step < KEYBOARD_STEPS; step += 1) {
    await page.keyboard.press("Tab");
    const state = await focusState(page);

    if (state.outside) {
      escaped = true;
      break;
    }

    if (visited.includes(state.key)) {
      const cycle = visited.length - visited.indexOf(state.key);
      record({
        route: route.path,
        viewport: viewport.name,
        rule: "piege-clavier",
        impact: "critical",
        blocking: true,
        detail: `la tabulation boucle sur ${cycle} élément(s) sans quitter la page, de nouveau sur ${state.name}`,
      });
      return;
    }

    if (state.invisible || !state.ringed) {
      record({
        route: route.path,
        viewport: viewport.name,
        rule: state.invisible ? "focus-sur-element-invisible" : "focus-non-visible",
        impact: "serious",
        blocking: true,
        detail: `${state.name} au ${step + 1}e tabulation`,
      });
    }

    visited.push(state.key);
  }

  /* Neither an exit nor a loop: the page is longer than the budget, and the
     sweep proves nothing about its end. Say so rather than call it clean. */
  if (!escaped) {
    record({
      route: route.path,
      viewport: viewport.name,
      rule: "balayage-clavier-incomplet",
      impact: "moderate",
      blocking: false,
      detail: `${KEYBOARD_STEPS} tabulations sans atteindre la fin de la page`,
    });
  }
};

/**
 * The mobile menu is a dialog: while it is open the focus must stay inside
 * it, and Escape must both close it and hand the focus back to the button
 * that opened it.
 */
const auditDrawer = async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "/");

  const trigger = page.getByRole("button", { name: "Ouvrir le menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").waitFor({ state: "visible" });

  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press("Tab");
    const state = await focusState(page);

    if (!state.outside && !state.inDialog) {
      record({
        route: "/",
        viewport: "390 px",
        rule: "menu-mobile-fuite",
        impact: "serious",
        blocking: true,
        detail: `la tabulation sort du menu ouvert vers ${state.name}`,
      });
      break;
    }
  }

  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });

  const returned = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Ouvrir le menu");

  if (!returned) {
    record({
      route: "/",
      viewport: "390 px",
      rule: "menu-mobile-focus-perdu",
      impact: "serious",
      blocking: true,
      detail: "après Échap, le focus ne revient pas sur le bouton du menu",
    });
  }
};

const auditReducedMotion = async (context, route) => {
  const page = await context.newPage();
  await serveOriginalImages(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, route.path);

  const animated = await runningAnimations(page);
  if (animated.length > 0) {
    record({
      route: route.path,
      viewport: "1440 px",
      rule: "prefers-reduced-motion",
      impact: "serious",
      blocking: true,
      detail: `animation encore active : ${animated.join(", ")}`,
    });
  }

  await page.close();
};

const run = async () => {
  const browser = await chromium.launch({
    ...(env.CHROMIUM_PATH ? { executablePath: env.CHROMIUM_PATH } : {}),
  });

  for (const route of ROUTES) {
    console.log(`\n${route.name} — ${route.path}`);

    /*
     * One context per page, rather than one for the whole run: leaving a
     * page mid-load cancels its images on the browser side while the server
     * is still resizing them, and the next navigations queue behind those
     * sockets — a page that answers in 150ms then takes minutes. A fresh
     * context starts from fresh connections.
     */
    const context = await browser.newContext({ locale: "fr-FR" });
    const page = await context.newPage();
    await serveOriginalImages(page);

    for (const viewport of VIEWPORTS) {
      await auditViewport(page, route, viewport);
    }

    await auditOutline(page, route);
    await auditReducedMotion(context, route);
    /* The narrow width carries the mobile menu, the wide one the full nav. */
    await auditKeyboard(page, route, VIEWPORTS[0]);
    await auditKeyboard(page, route, VIEWPORTS[2]);

    titles.push({ route: route.path, title: await page.title() });

    await context.close();
  }

  const drawerContext = await browser.newContext({ locale: "fr-FR" });
  const drawerPage = await drawerContext.newPage();
  await serveOriginalImages(drawerPage);
  console.log("\nMenu mobile — piège de focus");
  await auditDrawer(drawerPage);
  await drawerContext.close();

  console.log("\nTitres de page");
  const duplicates = titles.filter(
    (entry, index) => titles.findIndex((other) => other.title === entry.title) !== index
  );

  duplicates.forEach((entry) => {
    record({
      route: entry.route,
      viewport: "—",
      rule: "titre-de-page-en-double",
      impact: "moderate",
      blocking: false,
      detail: `« ${entry.title} » est déjà le titre d'une autre page`,
    });
  });

  await browser.close();

  const blocking = findings.filter((finding) => finding.blocking);

  console.log(`\n${"─".repeat(60)}`);
  console.log(`${ROUTES.length} pages × ${VIEWPORTS.length} largeurs`);
  console.log(`${findings.length} anomalie(s), dont ${blocking.length} bloquante(s)`);

  if (env.AUDIT_JSON) {
    writeFileSync(env.AUDIT_JSON, `${JSON.stringify({ baseUrl: BASE_URL, findings }, null, 2)}\n`);
    console.log(`Rapport complet : ${env.AUDIT_JSON}`);
  }

  /* `--soft` reports without failing, for a first pass on a work in progress. */
  if (blocking.length > 0 && !argv.includes("--soft")) exit(1);
};

run().catch((error) => {
  console.error(error);
  exit(1);
});
