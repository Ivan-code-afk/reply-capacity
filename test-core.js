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
];
let count=0;
for (const [name,fn] of tests){ try{ fn(); count++; console.log('✓',name);} catch(e){console.error('✗',name);throw e;} }
console.log(`${count}/${tests.length} tests passed`);
