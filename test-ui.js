// Browser-logic tests only: these do not replace layout or real-browser testing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function boot({ saved, blockedStorage = false, clipboardAvailable = true, fallbackSuccess = true } = {}) {
  const elements = new Map();
  for (const match of html.matchAll(/<([\w-]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const attrs = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    elements.set(match[3], { ...attrs, value: '', textContent: '', style: {}, handlers: {},
      addEventListener(name, fn) { this.handlers[name] = fn; },
      setAttribute(name, value) { this[name] = value; },
    });
  }
  let stored = saved;
  let copied;
  let temporaryField;
  const context = {
    Intl, setTimeout() {},
    localStorage: {
      getItem() { if (blockedStorage) throw Error('Storage blocked'); return stored; },
      setItem(key, value) { if (blockedStorage) throw Error('Storage blocked'); stored = value; },
      removeItem() { if (blockedStorage) throw Error('Storage blocked'); stored = null; },
    },
    navigator: clipboardAvailable ? { clipboard: { async writeText(value) { copied = value; } } } : {},
    document: {
      getElementById(id) { assert.ok(elements.has(id), `Missing element ${id}`); return elements.get(id); },
      createElement() { return { style: {}, select() {}, remove() { temporaryField = null; } }; },
      body: { appendChild(field) { temporaryField = field; } },
      execCommand(command) { assert.equal(command, 'copy'); copied = temporaryField.value; return fallbackSuccess; },
    },
  };
  context.window = context;
  vm.runInNewContext(fs.readFileSync('reply-capacity-core.js', 'utf8'), context);
  vm.runInNewContext(script, context);
  return {
    el: id => elements.get(id),
    result: () => context.currentReplyCapacityResult,
    stored: () => stored,
    copied: () => copied,
    temporaryField: () => temporaryField,
    change(key, value) {
      const target = elements.get(key + '-number'); target.value = value;
      target.handlers.change({ target });
    },
  };
}

async function main() {
  const ui = boot();
  assert.equal(ui.result().queueAfter, 70);
  ui.change('dailyMinutes', '61');
  assert.equal(ui.el('dailyMinutes-range').step, '1');
  assert.equal(Number(ui.el('dailyMinutes-range').value), 61);
  ui.change('dailyMinutes', 'Infinity');
  assert.equal(Number(ui.el('dailyMinutes-number').value), 61);
  ui.change('dailyMinutes', '');
  assert.equal(ui.result().inputs.dailyMinutes, 61);
  ui.change('dailyIncoming', '-1');
  assert.equal(ui.result().inputs.dailyIncoming, 0);
  ui.change('unanswered', '999999');
  assert.equal(ui.result().inputs.unanswered, 5000);
  const restored = boot({ saved: ui.stored() });
  assert.equal(restored.result().inputs.dailyMinutes, 61);
  restored.el('reset').handlers.click();
  assert.equal(restored.result().queueAfter, 70);
  assert.equal(restored.stored(), null);
  for (const saved of ['{', 'null', '{"dailyMinutes":-2}', '{"dailyMinutes":"60"}']) {
    assert.equal(boot({ saved }).result().queueAfter, 70);
  }
  const blocked = boot({ blockedStorage: true });
  blocked.change('dailyMinutes', '0');
  assert.equal(blocked.result().queueAfter, 175);
  blocked.el('reset').handlers.click();
  assert.equal(blocked.result().queueAfter, 70);
  await ui.el('copy').handlers.click();
  assert.ok(ui.copied().includes('\nБюджет времени: 61 мин/день'));
  const overloaded = boot();
  overloaded.change('dailyIncoming', '500');
  overloaded.change('minutesPerReply', '120');
  assert.ok(overloaded.result().minutesToClearWithinPeriod > 1440);
  assert.equal(overloaded.el('action-main').textContent, 'Разобрать за 7 дней не получится');
  await overloaded.el('copy').handlers.click();
  assert.ok(overloaded.copied().includes('больше 24 часов'));
  overloaded.el('reset').handlers.click();
  assert.equal(overloaded.el('action-main').textContent, '+40 мин в день');
  const boundary = boot();
  boundary.change('dailyIncoming', '12');
  boundary.change('unanswered', '0');
  boundary.change('minutesPerReply', '120');
  assert.equal(boundary.result().minutesToClearWithinPeriod, 1440);
  assert.equal(boundary.el('action-main').textContent, '+23 ч в день');
  for (const fallbackSuccess of [true, false]) {
    const fallback = boot({ clipboardAvailable: false, fallbackSuccess });
    await fallback.el('copy').handlers.click();
    assert.equal(fallback.el('copy-note').textContent, fallbackSuccess ? 'Результат скопирован ✓' : 'Скопировать не удалось');
    assert.equal(fallback.temporaryField(), null);
  }
  console.log('UI logic: input synchronization, bounds, persistence, reset, unavailable storage and clipboard passed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
