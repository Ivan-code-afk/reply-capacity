// Browser-logic tests only: these do not replace layout or real-browser testing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);

function boot({ saved, language, blockedStorage = false, clipboardAvailable = true, fallbackSuccess = true } = {}) {
  const elements = new Map();
  const nodes = [];
  for (const match of html.matchAll(/<([\w-]+)\b([^>]*)>/g)) {
    const attrs = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    const node = { ...attrs, tag: match[1], dataset: {i18n: attrs['data-i18n']}, value: '', textContent: '', style: {}, handlers: {},
      addEventListener(name, fn) { this.handlers[name] = fn; },
      setAttribute(name, value) { this[name] = value; },
    };
    nodes.push(node);
    if (attrs.id) { assert.ok(!elements.has(attrs.id), `Duplicate ID ${attrs.id}`); elements.set(attrs.id, node); }
  }
  const storage = new Map([['reply-capacity-v1', saved], ['reply-capacity-language', language]]);
  const timers = new Map();
  let timerId = 0;
  let copied;
  let temporaryField;
  const context = {
    Intl, setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout(id) { timers.delete(id); },
    localStorage: {
      getItem(key) { if (blockedStorage) throw Error('Storage blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blockedStorage) throw Error('Storage blocked'); storage.set(key, value); },
      removeItem(key) { if (blockedStorage) throw Error('Storage blocked'); storage.delete(key); },
    },
    navigator: clipboardAvailable ? { clipboard: { async writeText(value) { copied = value; } } } : {},
    document: {
      documentElement: nodes.find(node => node.tag === 'html'),
      querySelector(selector) { assert.equal(selector, 'meta[name="description"]'); return nodes.find(node => node.name === 'description'); },
      querySelectorAll(selector) { assert.equal(selector, '[data-i18n]'); return nodes.filter(node => node.dataset.i18n); },
      getElementById(id) { assert.ok(elements.has(id), `Missing element ${id}`); return elements.get(id); },
      createElement() { return { style: {}, select() {}, remove() { temporaryField = null; } }; },
      body: { appendChild(field) { temporaryField = field; } },
      execCommand(command) { assert.equal(command, 'copy'); copied = temporaryField.value; return fallbackSuccess; },
    },
  };
  context.window = context;
  for (const source of scripts) vm.runInNewContext(fs.readFileSync(source, 'utf8'), context, {filename:source});
  return {
    el: id => elements.get(id),
    result: () => context.currentReplyCapacityResult,
    stored: () => storage.get('reply-capacity-v1') ?? null,
    language: () => storage.get('reply-capacity-language'),
    context, nodes,
    switchLanguage(language) { elements.get('lang-' + language).handlers.click(); },
    flushTimers() { for (const [id, fn] of [...timers]) { timers.delete(id); fn(); } },
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
  assert.ok(ui.copied().includes('\nDaily time budget: 1 h 1 min'));
  const overloaded = boot();
  overloaded.change('dailyIncoming', '500');
  overloaded.change('minutesPerReply', '120');
  assert.ok(overloaded.result().minutesToClearWithinPeriod > 1440);
  assert.equal(overloaded.el('action-main').textContent, 'Cannot clear it in 7 days');
  await overloaded.el('copy').handlers.click();
  assert.ok(overloaded.copied().includes('more than 24 hours'));
  overloaded.el('reset').handlers.click();
  assert.equal(overloaded.el('action-main').textContent, '+40 min per day');
  const boundary = boot();
  boundary.change('dailyIncoming', '12');
  boundary.change('unanswered', '0');
  boundary.change('minutesPerReply', '120');
  assert.equal(boundary.result().minutesToClearWithinPeriod, 1440);
  assert.equal(boundary.el('action-main').textContent, '+23 h per day');
  for (const fallbackSuccess of [true, false]) {
    const fallback = boot({ clipboardAvailable: false, fallbackSuccess });
    await fallback.el('copy').handlers.click();
    assert.equal(fallback.el('copy-note').textContent, fallbackSuccess ? 'Result copied ✓' : 'Could not copy the result');
    assert.equal(fallback.temporaryField(), null);
  }
  await testLanguages();
  console.log('UI logic: input synchronization, bounds, persistence, reset, unavailable storage and clipboard passed');
}

async function testLanguages() {
  for (const language of [undefined, '', 'xx', 'EN', '{', 'null', '__proto__']) {
    assert.equal(boot({language}).context.document.documentElement.lang, 'en');
  }
  const ui = boot();
  const i18n = ui.context.ReplyCapacityI18n;
  const baselineKeys = Object.keys(i18n.dictionaries.en).sort();
  for (const language of ['en','ru','fr','de']) {
    assert.deepEqual(Object.keys(i18n.dictionaries[language]).sort(), baselineKeys);
    for (const [key,value] of Object.entries(i18n.dictionaries[language])) {
      if (typeof value === 'string') {
        assert.ok(value.length > 0, `${language}.${key}`);
        const placeholders = text => [...text.matchAll(/\{\w+\}/g)].map(match => match[0]).sort().join(',');
        assert.equal(placeholders(value), placeholders(i18n.dictionaries.en[key]), `${language}.${key} placeholders`);
        if (language !== 'ru') assert.ok(!/[а-яё]/i.test(value), `${language}.${key} contains Russian`);
      }
    }
    ui.change('dailyMinutes', '61');
    const before = JSON.stringify(ui.result());
    const beforeStorage = ui.stored();
    ui.switchLanguage(language);
    assert.equal(JSON.stringify(ui.result()), before, 'Language changes must preserve every calculation');
    assert.equal(ui.stored(), beforeStorage, 'Language changes must not overwrite input storage');
    assert.equal(ui.language(), language);
    assert.equal(ui.context.document.documentElement.lang, language);
    assert.equal(ui.context.document.title, i18n.t('pageTitle'));
    assert.equal(ui.el('languages')['aria-label'], i18n.t('languageLabel'));
    for (const code of ['en','ru','fr','de']) assert.equal(ui.el('lang-' + code)['aria-pressed'], String(code === language));
    for (const node of ui.nodes.filter(node => node.dataset.i18n)) assert.equal(node.textContent, i18n.t(node.dataset.i18n));
    await ui.el('copy').handlers.click();
    assert.ok(!/\{\w+\}/.test(ui.copied()));
    if (language !== 'ru') {
      const rendered = ui.nodes.map(node => [node.textContent, node['aria-label']].join(' ')).join(' ') + ui.el('queue-chart').innerHTML + ui.copied();
      assert.ok(!/[а-яё]/i.test(rendered), `${language}: untranslated Russian UI`);
    }
    const restored = boot({saved:ui.stored(),language:ui.language()});
    assert.equal(restored.context.document.documentElement.lang, language);
    assert.equal(restored.result().inputs.dailyMinutes,61);
    ui.el('reset').handlers.click();
    assert.equal(ui.language(),language);
    assert.equal(ui.context.document.documentElement.lang,language);
    assert.equal(ui.el('reset').textContent,i18n.t('resetDone'));
    ui.flushTimers();
    assert.equal(ui.el('reset').textContent,i18n.t('reset'));
    for (const scenario of [
      {dailyIncoming:0,unanswered:0,dailyMinutes:0},
      {dailyIncoming:0,unanswered:35,dailyMinutes:4},
      {dailyIncoming:15,unanswered:35,dailyMinutes:60},
      {dailyIncoming:20,unanswered:35,dailyMinutes:0},
      {dailyIncoming:500,unanswered:5000,minutesPerReply:120,dailyMinutes:0},
    ]) {
      const candidate = boot({language, saved:JSON.stringify(scenario)});
      await candidate.el('copy').handlers.click();
      assert.ok(!/\{\w+\}/.test(candidate.copied() + candidate.el('action-sub').textContent));
      if (language !== 'ru') assert.ok(!/[а-яё]/i.test(candidate.copied() + candidate.el('explain').textContent + candidate.el('action-sub').textContent));
    }
    const denied = boot({language, clipboardAvailable:false, fallbackSuccess:false});
    await denied.el('copy').handlers.click();
    assert.equal(denied.el('copy-note').textContent,denied.context.ReplyCapacityI18n.t('copyFailed'));
  }
  i18n.setLanguage('ru');
  for (const [n,expected] of [[1,'1 сообщение'],[2,'2 сообщения'],[5,'5 сообщений'],[21,'21 сообщение'],[22,'22 сообщения'],[25,'25 сообщений']]) assert.equal(i18n.count(n),expected);
  i18n.setLanguage('fr'); assert.equal(i18n.count(1),'1 message'); assert.equal(i18n.count(2),'2 messages');
  i18n.setLanguage('de'); assert.equal(i18n.count(1),'1 Nachricht'); assert.equal(i18n.count(2),'2 Nachrichten');
  i18n.setLanguage('en'); assert.equal(i18n.count(1),'1 message'); assert.equal(i18n.count(2),'2 messages');
  const blocked = boot({blockedStorage:true});
  blocked.switchLanguage('de'); blocked.el('reset').handlers.click();
  assert.equal(blocked.context.document.documentElement.lang,'de');
  const feedback = boot();
  feedback.el('reset').handlers.click(); feedback.switchLanguage('fr'); feedback.flushTimers();
  assert.equal(feedback.el('reset').textContent, feedback.context.ReplyCapacityI18n.t('reset'));
  await feedback.el('copy').handlers.click(); feedback.switchLanguage('de');
  assert.equal(feedback.el('copy-note').textContent, feedback.context.ReplyCapacityI18n.t('copyDone'));
  feedback.flushTimers(); assert.equal(feedback.el('copy-note').textContent, feedback.context.ReplyCapacityI18n.t('copyNote'));
  console.log('Localization: EN default, 4 complete dictionaries, plural forms, all states, ARIA, persistence and feedback passed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
