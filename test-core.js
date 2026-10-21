const assert = require('node:assert/strict');
const {simulate} = require('./reply-capacity-core');
const tests = [
  ['default 7-day result', () => { const r=simulate(); assert.equal(r.dailyCapacity, 15); assert.equal(r.queueAfter, 70); assert.equal(r.additionalMinutes, 40); assert.equal(r.state,'growing'); assert.equal(r.totalAnswered,105); }],
  ['enough time with no backlog', () => { const r=simulate({dailyIncoming:10,unanswered:0,minutesPerReply:3,dailyMinutes:60}); assert.equal(r.queueAfter,0); assert.equal(r.state,'clear'); assert.equal(r.additionalMinutes,0); }],
  ['backlog clears in two days', () => { const r=simulate({dailyIncoming:10,unanswered:15,minutesPerReply:3,dailyMinutes:60}); assert.equal(r.series[0].queue,5); assert.equal(r.series[1].queue,0); assert.equal(r.daysToClearCurrentBacklog,2); }],
  ['exact balance leaves backlog', () => { const r=simulate({dailyIncoming:15,unanswered:5,minutesPerReply:4,dailyMinutes:60}); assert.equal(r.queueAfter,5); assert.equal(r.state,'steady'); }],
  ['zero arrivals', () => { const r=simulate({dailyIncoming:0,unanswered:12,minutesPerReply:3,dailyMinutes:6}); assert.equal(r.queueAfter,0); assert.equal(r.daysToClearCurrentBacklog,6); }],
  ['no working time', () => { const r=simulate({dailyIncoming:3,unanswered:2,minutesPerReply:5,dailyMinutes:0}); assert.equal(r.dailyCapacity,0); assert.equal(r.queueAfter,23); assert.equal(r.additionalMinutes,20); }],
  ['empty system', () => { const r=simulate({dailyIncoming:0,unanswered:0,minutesPerReply:2,dailyMinutes:0}); assert.equal(r.queueAfter,0); assert.equal(r.additionalMinutes,0); assert.equal(r.state,'clear'); }],
  ['insufficient time for one reply', () => { const r=simulate({dailyIncoming:2,unanswered:0,minutesPerReply:10,dailyMinutes:9}); assert.equal(r.dailyCapacity,0); assert.equal(r.queueAfter,14); }],
  ['one day planning', () => { const r=simulate({dailyIncoming:2,unanswered:3,minutesPerReply:4,dailyMinutes:20,days:1}); assert.equal(r.queueAfter,0); assert.equal(r.additionalMinutes,0); }],
  ['one minute additional enough for integer cap crossing', () => { const r=simulate({dailyIncoming:2,unanswered:0,minutesPerReply:3,dailyMinutes:5}); assert.equal(r.additionalMinutes,1); }],
  ['allowable upper bounds', () => { const r=simulate({dailyIncoming:100000,unanswered:1000000,minutesPerReply:240,dailyMinutes:1440,days:365}); assert.equal(r.series.length,365); }],
  ['reject negative inputs', () => assert.throws(()=>simulate({dailyIncoming:-1}),RangeError)],
  ['reject fractional numbers', () => assert.throws(()=>simulate({dailyMinutes:1.5}),RangeError)],
  ['reject invalid duration', () => assert.throws(()=>simulate({days:0}),RangeError)],
  ['determinism', () => assert.deepEqual(simulate(),simulate())],
  ['stock conservation', () => { const r=simulate(); assert.equal(r.inputs.unanswered+r.totalIncoming-r.totalAnswered,r.queueAfter); }],
  ['required additional time really clears backlog', () => { const a=simulate(); const b=simulate({...a.inputs,dailyMinutes:a.inputs.dailyMinutes+a.additionalMinutes}); assert.equal(b.queueAfter,0); }],
  ['independent queue balance and minimum daily budget across 3360 scenarios', () => {
    for (const dailyIncoming of [0,1,2,20,100000])
    for (const unanswered of [0,1,6,7,8,35,1000000])
    for (const minutesPerReply of [1,3,4,240])
    for (const dailyMinutes of [0,1,5,60,1439,1440])
    for (const days of [1,2,7,365]) {
      const r = simulate({dailyIncoming,unanswered,minutesPerReply,dailyMinutes,days});
      const cap = Math.floor(dailyMinutes / minutesPerReply);
      const expectedQueue = Math.max(0, unanswered + days * (dailyIncoming - cap));
      assert.equal(r.queueAfter, expectedQueue);
      assert.equal(r.totalAnswered, unanswered + days * dailyIncoming - expectedQueue);
      r.series.forEach((day, i) => {
        const before = i === 0 ? unanswered : r.series[i-1].queue;
        assert.equal(day.queue + day.answered, before + dailyIncoming);
        assert.ok(day.answered <= cap && day.queue >= 0);
      });
      const required = r.minutesToClearWithinPeriod;
      assert.equal(Math.max(0, unanswered + days * (dailyIncoming - Math.floor(required / minutesPerReply))), 0);
      if (required > 0) {
        assert.ok(unanswered + days * (dailyIncoming - Math.floor((required - 1) / minutesPerReply)) > 0);
      }
      assert.equal(r.additionalMinutes, Math.max(0, required - dailyMinutes));
    }
  }],
  ['reject invalid values for every bounded input', () => {
    const limits = {dailyIncoming:[0,100000],unanswered:[0,1000000],minutesPerReply:[1,240],dailyMinutes:[0,1440],days:[1,365]};
    for (const [key,[min,max]] of Object.entries(limits)) {
      for (const value of [NaN,Infinity,-Infinity,'1',null,undefined,1.5,min-1,max+1]) {
        assert.throws(() => simulate({[key]:value}), RangeError);
      }
    }
  }],
];
let count=0;
for (const [name,fn] of tests){ try{ fn(); count++; console.log('✓',name);} catch(e){console.error('✗',name);throw e;} }
console.log(`${count}/${tests.length} tests passed`);
