/* Reply Capacity — deterministic queue engine (MIT, no dependencies).
 * Inspired by the explicitly described stock / flow / limit / switch mechanisms
 * in the user-supplied DIN-Prognoz presentation; NOT its original source code.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.ReplyCapacity = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DEFAULTS = Object.freeze({
    dailyIncoming: 20,
    unanswered: 35,
    minutesPerReply: 4,
    dailyMinutes: 60,
    days: 7,
  });

  function requireWhole(name, value, min, max) {
    if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
      throw new RangeError(`${name}: expected integer in [${min}, ${max}]`);
    }
    return value;
  }

  function simulate(raw = {}) {
    const args = { ...DEFAULTS, ...raw };
    const dailyIncoming = requireWhole('dailyIncoming', args.dailyIncoming, 0, 100000);
    const unanswered = requireWhole('unanswered', args.unanswered, 0, 1000000);
    const minutesPerReply = requireWhole('minutesPerReply', args.minutesPerReply, 1, 240);
    const dailyMinutes = requireWhole('dailyMinutes', args.dailyMinutes, 0, 1440);
    const days = requireWhole('days', args.days, 1, 365);
    const dailyCapacity = Math.floor(dailyMinutes / minutesPerReply);

    let queue = unanswered;
    let totalAnswered = 0;
    const series = [];

    for (let day = 1; day <= days; day += 1) {
      const available = queue + dailyIncoming;
      const answered = Math.min(available, dailyCapacity);
      queue = available - answered;
      totalAnswered += answered;
      series.push({ day, received: dailyIncoming, answered, queue });
    }

    const necessaryCapacity = dailyIncoming + Math.ceil(unanswered / days);
    const minutesToClearWithinPeriod = necessaryCapacity * minutesPerReply;
    const additionalMinutes = Math.max(0, minutesToClearWithinPeriod - dailyMinutes);
    const minutesToHandleDailyIncoming = dailyIncoming * minutesPerReply;
    const dailyDeficit = Math.max(0, dailyIncoming - dailyCapacity);
    const daysToClearCurrentBacklog = unanswered === 0
      ? 0
      : dailyCapacity > dailyIncoming
        ? Math.ceil(unanswered / (dailyCapacity - dailyIncoming))
        : null;
    const minutesPerReplyToClearWithinPeriod = necessaryCapacity > 0
      ? dailyMinutes / necessaryCapacity
      : null;

    let state;
    if (queue === 0) state = 'clear';
    else if (queue < unanswered) state = 'shrinking';
    else if (queue === unanswered) state = 'steady';
    else state = 'growing';

    return {
      inputs: { dailyIncoming, unanswered, minutesPerReply, dailyMinutes, days },
      dailyCapacity,
      queueAfter: queue,
      queueChange: queue - unanswered,
      totalAnswered,
      totalIncoming: days * dailyIncoming,
      dailyDeficit,
      state,
      minutesToHandleDailyIncoming,
      minutesToClearWithinPeriod,
      additionalMinutes,
      necessaryCapacity,
      daysToClearCurrentBacklog,
      minutesPerReplyToClearWithinPeriod,
      series,
    };
  }

  return { DEFAULTS, simulate };
});
