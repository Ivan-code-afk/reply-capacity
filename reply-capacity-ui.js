(function () {
  'use strict';
  const engine = window.ReplyCapacity;
  const i18n = window.ReplyCapacityI18n;
  const { t, count, time } = i18n;
  const keys = ['dailyIncoming', 'unanswered', 'minutesPerReply', 'dailyMinutes'];
  const bounds = {dailyIncoming:[0,500], unanswered:[0,5000], minutesPerReply:[1,120], dailyMinutes:[0,1440]};
  const el = id => document.getElementById(id);
  let inputs = {...engine.DEFAULTS};
  let resetDone = false;
  let copyState = 'copyNote';
  let resetTimer;
  let copyTimer;
  let copyVersion = 0;
  try {
    const saved = JSON.parse(localStorage.getItem('reply-capacity-v1'));
    if (saved && typeof saved === 'object') {
      for (const key of keys) {
        if (Number.isInteger(saved[key]) && saved[key] >= bounds[key][0] && saved[key] <= bounds[key][1]) inputs[key] = saved[key];
      }
    }
  } catch (_) {}
  try { i18n.setLanguage(localStorage.getItem('reply-capacity-language')); } catch (_) {}

  function sync() {
    for (const key of keys) {
      el(key + '-number').value = inputs[key];
      const range = el(key + '-range');
      range.value = Math.min(Number(range.max), inputs[key]);
    }
  }
  function applyLanguage() {
    document.documentElement.lang = i18n.language;
    document.title = t('pageTitle');
    document.querySelector('meta[name="description"]').setAttribute('content', t('description'));
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    for (const key of keys) el(key + '-range').setAttribute('aria-label', t(key));
    el('languages').setAttribute('aria-label', t('languageLabel'));
    for (const language of i18n.supported) {
      el('lang-' + language).setAttribute('aria-pressed', String(language === i18n.language));
      el('lang-' + language).setAttribute('aria-label', t('language' + language[0].toUpperCase() + language.slice(1)));
    }
    render();
  }
  function renderFeedback() {
    el('reset').textContent = t(resetDone ? 'resetDone' : 'reset');
    el('copy-note').textContent = t(copyState);
  }
  function updateInput(key, value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) { sync(); return; }
    inputs[key] = Math.min(bounds[key][1], Math.max(bounds[key][0], n));
    sync();
    try { localStorage.setItem('reply-capacity-v1', JSON.stringify(inputs)); } catch (_) {}
    copyVersion += 1;
    copyState = 'copyNote';
    render();
  }
  for (const key of keys) {
    el(key + '-range').addEventListener('input', event => updateInput(key, event.target.value));
    el(key + '-number').addEventListener('change', event => updateInput(key, event.target.value === '' ? inputs[key] : event.target.value));
    el(key + '-number').addEventListener('keydown', event => { if (event.key === 'Enter') event.target.blur(); });
  }
  for (const language of i18n.supported) {
    el('lang-' + language).addEventListener('click', () => {
      i18n.setLanguage(language);
      try { localStorage.setItem('reply-capacity-language', language); } catch (_) {}
      applyLanguage();
    });
  }
  el('reset').addEventListener('click', () => {
    inputs = {...engine.DEFAULTS};
    sync();
    try { localStorage.removeItem('reply-capacity-v1'); } catch (_) {}
    resetDone = true;
    copyState = 'copyNote';
    copyVersion += 1;
    render();
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { resetDone = false; renderFeedback(); }, 1500);
  });
  const escapeXML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;'}[c]));
  function graph(result) {
    const svg = el('queue-chart');
    const max = Math.max(1, ...result.series.map(day => day.queue));
    const fill = result.state === 'clear' ? '#13866b' : result.state === 'growing' ? '#eb885c' : '#4785a0';
    let markup = `<title>${escapeXML(t('chartTitle'))}</title><desc>${escapeXML(t('chartDescription'))}</desc>`;
    markup += '<line x1="10" y1="158" x2="622" y2="158" stroke="#d9e2dc" stroke-width="1"/>';
    const labels = [];
    result.series.forEach((day, index) => {
      const x = 36 + index * 82;
      const height = day.queue === 0 ? 0 : Math.max(5, day.queue / max * 119);
      const y = 158 - height;
      const label = t('chartDay', {day: i18n.number(day.day), messages: count(day.queue)});
      labels.push(label);
      markup += `<rect x="${x}" y="${y}" width="39" height="${height}" rx="7" fill="${fill}" opacity="${0.69 + index * .04}"><title>${escapeXML(label)}</title></rect>`;
      markup += `<text x="${x + 19.5}" y="${Math.max(12, y - 7)}" text-anchor="middle" font-size="13" font-weight="700" fill="#455d53">${escapeXML(i18n.number(day.queue))}</text>`;
      markup += `<text x="${x + 19.5}" y="179" text-anchor="middle" font-size="12" fill="#83918a">${escapeXML(t('shortDay', {day: i18n.number(day.day)}))}</text>`;
    });
    svg.innerHTML = markup;
    svg.setAttribute('aria-label', t('chartAria', {series: labels.join('; ')}));
  }
  function render() {
    const result = engine.simulate({...inputs, days: 7});
    el('state').className = 'status ' + ({clear:'good', growing:'danger', shrinking:'neutral', steady:'neutral'}[result.state]);
    el('state-text').textContent = t(result.state);
    el('queue-after').textContent = i18n.number(result.queueAfter);
    // The unit is separate visually; its full count also appears in the chart and copied result.
    const forms = i18n.dictionaries[i18n.language].messageForms;
    el('queue-unit').textContent = forms[new Intl.PluralRules(i18n.language).select(result.queueAfter)] || forms.other;
    el('capacity').textContent = i18n.number(result.dailyCapacity);
    el('answered').textContent = i18n.number(result.totalAnswered);
    let detail;
    if (result.queueAfter === 0) detail = t(inputs.unanswered > 0 ? 'clearOld' : 'clearNew');
    else if (result.queueChange > 0) detail = t('growingDetail', {messages: count(result.queueChange)});
    else if (result.queueChange < 0) detail = t('shrinkingDetail', {messages: count(-result.queueChange)});
    else detail = t('steadyDetail');
    el('explain').textContent = detail;
    el('action').className = 'action' + (result.additionalMinutes > 0 ? ' warning' : '');
    if (result.additionalMinutes > 0) {
      const impossible = result.minutesToClearWithinPeriod > 1440;
      el('action-heading').textContent = t(impossible ? 'impossibleHeading' : 'actionHeading');
      el('action-main').textContent = impossible ? t('impossibleMain') : t('additional', {time: time(result.additionalMinutes)});
      el('action-sub').textContent = t(impossible ? 'impossibleDetail' : 'actionDetail', {required: time(result.minutesToClearWithinPeriod), current: time(inputs.dailyMinutes)});
    } else {
      el('action-heading').textContent = t('enoughHeading');
      el('action-main').textContent = t('enoughMain');
      const reserve = Math.max(0, inputs.dailyMinutes - result.minutesToHandleDailyIncoming);
      el('action-sub').textContent = inputs.unanswered > 0 ? t('enoughOld') : t('enoughNew', {
        time: time(result.minutesToHandleDailyIncoming), reserve: reserve > 0 ? t('reserve', {time: time(reserve)}) : t('noReserve'),
      });
    }
    graph(result);
    renderFeedback();
    window.currentReplyCapacityResult = result;
  }
  el('copy').addEventListener('click', async () => {
    const result = window.currentReplyCapacityResult;
    const version = ++copyVersion;
    let message = t('copyReport', {
      incoming: count(result.inputs.dailyIncoming), backlog: count(result.inputs.unanswered),
      replyTime: time(result.inputs.minutesPerReply), budget: time(result.inputs.dailyMinutes),
      capacity: count(result.dailyCapacity, 'replyForms'), queue: count(result.queueAfter), extra: time(result.additionalMinutes),
    });
    if (result.minutesToClearWithinPeriod > 1440) message += '\n' + t('copyImpossible');
    let ok = false;
    const focused = document.activeElement;
    try { await navigator.clipboard.writeText(message); ok = true; }
    catch (_) {
      const field = document.createElement('textarea');
      field.value = message;
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.appendChild(field);
      field.select();
      try { ok = document.execCommand('copy'); } catch (_) {}
      field.remove();
      if (focused && typeof focused.focus === 'function') focused.focus();
    }
    if (version !== copyVersion) return;
    copyState = ok ? 'copyDone' : 'copyFailed';
    renderFeedback();
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyState = 'copyNote'; renderFeedback(); }, 2500);
  });
  sync();
  applyLanguage();
})();
