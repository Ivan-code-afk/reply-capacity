// Generate an isolated copy for a real file:// launch; never modify the application.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'reply-capacity-file-'));
for (const name of ['reply-capacity-core.js','reply-capacity-i18n.js','reply-capacity-ui.js']) {
  fs.copyFileSync(name, path.join(directory, name));
}
const check = `<script>
try {
  if (location.protocol !== 'file:') throw Error('Expected file protocol');
  if (!window.currentReplyCapacityResult || window.currentReplyCapacityResult.queueAfter !== 70) throw Error('Initial calculation failed');
  if (document.documentElement.lang !== 'en') throw Error('Default language failed');
  const before = JSON.stringify(window.currentReplyCapacityResult);
  document.getElementById('lang-fr').click();
  if (document.documentElement.lang !== 'fr' || JSON.stringify(window.currentReplyCapacityResult) !== before) throw Error('Language switch failed');
  document.getElementById('reset').click();
  if (document.documentElement.lang !== 'fr' || window.currentReplyCapacityResult.queueAfter !== 70) throw Error('Reset failed');
  document.documentElement.setAttribute('data-file-status','passed');
} catch (error) {
  document.documentElement.setAttribute('data-file-status','failed');
  document.body.appendChild(document.createTextNode(String(error)));
}
</script>`;
fs.writeFileSync(path.join(directory,'index.html'), fs.readFileSync('index.html','utf8').replace('</body>',check + '\n</body>'));
console.log(path.join(directory,'index.html'));
