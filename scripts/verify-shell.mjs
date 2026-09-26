/**
 * Real-browser verification of the Phase 1 shell.
 *
 * Drives the locally installed Chrome over the DevTools Protocol (no browser
 * automation dependency — Node's global WebSocket is enough). Starts the
 * production server, then checks the shell at mobile / tablet / desktop widths:
 * horizontal overflow, navigation visibility per breakpoint, accessible names,
 * skip link, active-route semantics, the mobile "More" dialog focus behaviour,
 * and client-side navigation.
 *
 * Usage: node scripts/verify-shell.mjs
 * Requires: a production build (.next) and Google Chrome installed.
 * Override the browser with CHROME_PATH.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SERVER_PORT = 3210;
const CDP_PORT = 9333;
const BASE = `http://127.0.0.1:${SERVER_PORT}`;

const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForHttp(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.listeners.get(msg.method) ?? []) fn(msg.params, msg.sessionId);
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }

  on(method, fn) {
    const list = this.listeners.get(method) ?? [];
    list.push(fn);
    this.listeners.set(method, list);
  }
}

async function main() {
  const profileDir = mkdtempSync(join(tmpdir(), "mellon-verify-"));
  let server;
  let chrome;
  let browserWs;

  try {
    // 1. Production server.
    server = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start", "-p", String(SERVER_PORT)],
      { stdio: "ignore", windowsHide: true },
    );
    await waitForHttp(`${BASE}/`);
    check("production server responds", true, BASE);

    // 2. Chrome with remote debugging.
    chrome = spawn(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--disable-background-networking",
        `--remote-debugging-port=${CDP_PORT}`,
        `--user-data-dir=${profileDir}`,
        "about:blank",
      ],
      { stdio: "ignore", windowsHide: true },
    );
    await waitForHttp(`http://127.0.0.1:${CDP_PORT}/json/version`);
    const version = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).json();
    check("Chrome launched", true, version.Browser);

    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    const cdp = new Cdp(ws);
    browserWs = ws;

    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", {
      targetId,
      flatten: true,
    });

    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);

    const evaluate = async (expression) => {
      const res = await cdp.send(
        "Runtime.evaluate",
        { expression, returnByValue: true, awaitPromise: true },
        sessionId,
      );
      if (res.exceptionDetails) {
        throw new Error(`Evaluation failed: ${res.exceptionDetails.text}`);
      }
      return res.result.value;
    };

    const waitFor = async (expression, timeoutMs = 8000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (await evaluate(`Boolean(${expression})`)) return true;
        await sleep(100);
      }
      return false;
    };

    const goto = async (path) => {
      await cdp.send("Page.navigate", { url: `${BASE}${path}` }, sessionId);
      await sleep(400);
      await waitFor("document.readyState === 'complete'");
      // Allow React to hydrate before interacting.
      await sleep(900);
    };

    const setViewport = async (width, height) => {
      await cdp.send(
        "Emulation.setDeviceMetricsOverride",
        { width, height, deviceScaleFactor: 1, mobile: false },
        sessionId,
      );
    };

    const MEASURE = `(() => {
      const de = document.documentElement;
      const bar = document.querySelector('nav[aria-label="Primary mobile"]');
      const rail = document.querySelector('nav[aria-label="Primary"]');
      const visible = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const homeLink = rail ? [...rail.querySelectorAll('a')].find((a) => a.getAttribute('href') === '/') : null;
      const label = homeLink ? homeLink.querySelector('span:last-child') : null;
      const main = document.querySelector('#main-content');
      return {
        innerWidth: window.innerWidth,
        scrollWidth: de.scrollWidth,
        railVisible: visible(rail),
        railWidth: rail ? Math.round(rail.getBoundingClientRect().width) : 0,
        bottomNavVisible: visible(bar),
        labelWidth: label ? Math.round(label.getBoundingClientRect().width) : -1,
        mainWidth: main ? Math.round(main.getBoundingClientRect().width) : 0,
        mainPadLeft: main ? getComputedStyle(main).paddingLeft : 'none',
        h1Count: document.querySelectorAll('h1').length,
        hasSkipLink: !!document.querySelector('a.skip-link'),
        // Only visible navigation matters — the rail and bottom bar both exist in the DOM.
        currentCount: [...document.querySelectorAll('[aria-current="page"]')].filter(visible).length,
        currentHref: [...document.querySelectorAll('[aria-current="page"]')].filter(visible)[0]?.getAttribute('href') ?? null,
        iconOnlyLabels: rail
          ? [...rail.querySelectorAll('a span:last-child')].every((s) => s.getBoundingClientRect().width <= 2)
          : null,
      };
    })()`;

    const almost = (a, b, tol = 2) => Math.abs(a - b) <= tol;
    const noOverflow = (m) => m.scrollWidth <= m.innerWidth + 1;

    // 3. Mobile (375).
    await setViewport(375, 812);
    await goto("/");
    let m = await evaluate(MEASURE);
    check("mobile 375: no horizontal overflow", noOverflow(m), `scrollWidth ${m.scrollWidth} / innerWidth ${m.innerWidth}`);
    check("mobile 375: bottom navigation visible", m.bottomNavVisible);
    check("mobile 375: desktop rail hidden", !m.railVisible);
    check("mobile 375: exactly one h1", m.h1Count === 1, `found ${m.h1Count}`);
    check("mobile 375: skip link present", m.hasSkipLink);
    check("mobile 375: one active nav item", m.currentCount === 1, `found ${m.currentCount} (${m.currentHref})`);

    // Skip link must become visible on focus (keyboard reachable + visible).
    const skipTop = await evaluate(
      "(() => { const a = document.querySelector('a.skip-link'); a.focus(); return Math.round(a.getBoundingClientRect().top); })()",
    );
    check("mobile 375: skip link visible when focused", skipTop >= 0, `top ${skipTop}px`);

    // Mobile "More" dialog: opens, traps focus, Escape closes, focus returns.
    const triggerOk = await evaluate(
      `(() => {
        const btn = document.querySelector('nav[aria-label="Primary mobile"] button[aria-haspopup="dialog"]');
        if (!btn) return false;
        btn.setAttribute('data-verify-trigger', '1');
        btn.click();
        return true;
      })()`,
    );
    const dialogOpen = triggerOk && (await waitFor("document.querySelector('[role=dialog]')"));
    check("mobile 375: More dialog opens", Boolean(dialogOpen));

    if (dialogOpen) {
      const dialogState = await evaluate(
        `(() => {
          const d = document.querySelector('[role=dialog]');
          return {
            focusInside: d.contains(document.activeElement),
            hasName: !!(d.getAttribute('aria-labelledby') || d.getAttribute('aria-label')),
            linkCount: d.querySelectorAll('a').length,
          };
        })()`,
      );
      check("mobile 375: dialog has accessible name", dialogState.hasName);
      check("mobile 375: dialog moves focus inside", dialogState.focusInside);
      check("mobile 375: dialog lists secondary routes", dialogState.linkCount === 4, `${dialogState.linkCount} links`);

      await cdp.send(
        "Input.dispatchKeyEvent",
        { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 },
        sessionId,
      );
      await cdp.send(
        "Input.dispatchKeyEvent",
        { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 },
        sessionId,
      );
      const closed = await waitFor("!document.querySelector('[role=dialog]')");
      check("mobile 375: Escape closes dialog", closed);
      // Radix restores focus after the close transition, so poll rather than sample once.
      const focusReturned = await waitFor(
        "document.activeElement?.hasAttribute('data-verify-trigger') === true",
      );
      check("mobile 375: focus returns to trigger", focusReturned);
    }

    // Client-side navigation to Goals via the bottom bar.
    await evaluate(
      `(() => {
        const link = [...document.querySelectorAll('nav[aria-label="Primary mobile"] a')].find((a) => a.getAttribute('href') === '/goals');
        link?.click();
        return true;
      })()`,
    );
    const navigated = await waitFor("location.pathname === '/goals'");
    check("mobile 375: bottom nav navigates (client-side)", navigated);
    const goalsActive = await evaluate(
      "document.querySelector('[aria-current=page]')?.getAttribute('href') === '/goals'",
    );
    check("mobile 375: active state follows route", goalsActive);

    // 4. Tablet (768) — icon rail, no bottom bar.
    await setViewport(768, 1024);
    await goto("/focus");
    m = await evaluate(MEASURE);
    check("tablet 768: no horizontal overflow", noOverflow(m), `scrollWidth ${m.scrollWidth} / innerWidth ${m.innerWidth}`);
    check("tablet 768: icon rail visible", m.railVisible);
    check("tablet 768: rail is 76px", almost(m.railWidth, 76), `${m.railWidth}px`);
    check("tablet 768: bottom navigation hidden", !m.bottomNavVisible);
    check("tablet 768: rail labels hidden (icon only)", m.iconOnlyLabels === true);
    check("tablet 768: active route is Focus", m.currentHref === "/focus", String(m.currentHref));

    // 5. Desktop (1280) — full rail with labels.
    await setViewport(1280, 900);
    await goto("/");
    m = await evaluate(MEASURE);
    check("desktop 1280: no horizontal overflow", noOverflow(m), `scrollWidth ${m.scrollWidth} / innerWidth ${m.innerWidth}`);
    check("desktop 1280: rail is 240px", almost(m.railWidth, 240), `${m.railWidth}px`);
    check("desktop 1280: rail labels visible", m.labelWidth >= 20, `${m.labelWidth}px`);
    check("desktop 1280: bottom navigation hidden", !m.bottomNavVisible);
    check("desktop 1280: content max width ≤ 1160", m.mainWidth <= 1160, `${m.mainWidth}px`);
    check("desktop 1280: desktop gutters are 40px", m.mainPadLeft === "40px", m.mainPadLeft);

    // 6. Narrow mobile (320) — the tightest real width, whole app.
    await setViewport(320, 720);
    for (const path of ["/", "/goals", "/insights", "/settings"]) {
      await goto(path);
      m = await evaluate(MEASURE);
      check(`narrow 320${path}: no horizontal overflow`, noOverflow(m), `scrollWidth ${m.scrollWidth} / innerWidth ${m.innerWidth}`);
    }

    // 7. Deeper route resolves (dynamic segment).
    await setViewport(1280, 900);
    await goto("/goals/example-id");
    const goalHeading = await evaluate("document.querySelector('h1')?.textContent ?? ''");
    check("route /goals/[goalId] renders", goalHeading.length > 0, goalHeading);
  } finally {
    if (browserWs) browserWs.close();
    chrome?.kill();
    server?.kill();
    await sleep(300);
    try {
      rmSync(profileDir, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  }

  // Report.
  const failed = results.filter((r) => !r.pass);
  console.log("");
  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  — ${r.detail}` : ""}`);
  }
  console.log("");
  console.log(`${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length > 0) {
    console.log(`\n${failed.length} FAILED:`);
    for (const f of failed) console.log(`  - ${f.name}${f.detail ? ` (${f.detail})` : ""}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Verification error:", error);
  process.exitCode = 1;
});
