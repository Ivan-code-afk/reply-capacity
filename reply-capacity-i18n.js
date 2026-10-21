/* Local dictionaries only. No browser-language detection or network services. */
(function (root) {
  'use strict';
  const dictionaries = {
    en: {
      languageEn: 'English', languageRu: 'Russian', languageFr: 'French', languageDe: 'German',
      pageTitle: 'Reply Capacity — time to reply to everyone?',
      description: 'Reply Capacity calculates your message workload, seven-day backlog and the extra daily time needed to clear it.',
      languageLabel: 'Interface language', tag: 'No sign-up or social accounts needed',
      eyebrow: 'One task. A clear answer.', heroStart: 'Can you ', heroEnd: 'reply to everyone?',
      lead: 'Find out in seconds whether you have time for customer messages — and how your backlog will change over the next week.',
      setupTitle: 'Your workload', parameters: '4 parameters',
      dailyIncoming: 'New messages per day', unanswered: 'Waiting for a reply', minutesPerReply: 'Minutes per reply', dailyMinutes: 'Daily time for replies',
      incomingHint: 'Messages that each need a separate reply', backlogHint: 'Your current unanswered messages', replyHint: 'The average time you actually spend', timeHint: 'Excluding editing, calls and other tasks',
      itemUnit: 'msg', minuteUnit: 'min', hourUnit: 'h', privacy: 'Your data stays in this browser', reset: 'Reset example', resetDone: 'Example restored ✓',
      resultsTitle: 'Your next 7 days', live: 'Updates as you change inputs', queueKicker: 'Still unanswered after 7 days',
      capacityLabel: 'daily reply capacity', answeredLabel: 'replies over the next 7 days',
      clear: 'The backlog will be cleared', shrinking: 'The backlog is shrinking', steady: 'The backlog is not shrinking', growing: 'The backlog is growing',
      clearOld: 'At this workload, you will clear the backlog and handle new messages.', clearNew: 'Your daily time is enough to handle new messages.',
      growingDetail: 'The backlog will grow by {messages} over the week. More messages arrive than you can answer.',
      shrinkingDetail: 'The backlog will shrink by {messages} over the week, but some messages will still be waiting.',
      steadyDetail: 'The backlog will stay the same: your time covers new messages, but does not reduce the existing queue.',
      actionHeading: 'Clear the backlog in 7 days', additional: '+{time} per day',
      actionDetail: 'You need {required} per day instead of {current}. Under these assumptions, this covers new messages and the existing backlog.',
      impossibleHeading: 'The workload exceeds 24 hours a day', impossibleMain: 'Cannot clear it in 7 days',
      impossibleDetail: 'The calculation requires {required} per day instead of {current}. That is more than 24 hours: at this reply speed, one person cannot handle this workload.',
      enoughHeading: 'Your current time is enough', enoughMain: 'No extra time needed', enoughOld: 'With this daily inflow, the backlog will be cleared by the end of the week.',
      enoughNew: 'New messages need {time} per day. {reserve}', reserve: '{time} left over.', noReserve: 'No spare time remains.',
      chartHeading: 'Backlog by day', chartHint: 'with a constant workload', chartTitle: 'Unanswered messages', chartDescription: 'Bars show the backlog at the end of each of the seven days.',
      chartAria: 'Daily backlog: {series}', chartDay: 'Day {day}: {messages} unanswered', shortDay: 'D{day}',
      copy: 'Copy result ↗', copyNote: 'No reach forecasts or hidden algorithms', copyDone: 'Result copied ✓', copyFailed: 'Could not copy the result',
      methodHeading: 'How is this calculated?',
      method: 'Each day, new messages join the queue. We subtract as many replies as fit in your daily time budget. Formula: next queue = max(0, current queue + new messages − replies sent). The workload stays the same for all 7 days, including weekends. This is a scenario calculation, not a prediction of actual future messages.',
      footer: 'Reply Capacity · A single-purpose prototype. All example values are illustrative.', footerPrivacy: 'No accounts, tracking or data sent to a server.',
      messageForms: {one: 'message', other: 'messages'}, replyForms: {one: 'reply', other: 'replies'},
      copyReport: 'Reply Capacity — 7-day scenario\nIncoming: {incoming} per day\nWaiting for a reply: {backlog}\nTime per reply: {replyTime}\nDaily time budget: {budget}\nDaily capacity: {capacity}\nUnanswered after 7 days: {queue}\nExtra daily time to clear the backlog in 7 days: {extra}\nAssumption: the same workload every day.',
      copyImpossible: 'Limit: more than 24 hours per day are required; this scenario is impossible for one person.',
    },
    ru: {
      languageEn: 'Английский', languageRu: 'Русский', languageFr: 'Французский', languageDe: 'Немецкий',
      pageTitle: 'Reply Capacity — успеете ответить всем?',
      description: 'Reply Capacity рассчитывает нагрузку на сообщения, очередь за семь дней и дополнительное ежедневное время для разгрузки.',
      languageLabel: 'Язык интерфейса', tag: 'Без регистрации и подключения соцсетей',
      eyebrow: 'Одна функция. Чёткий ответ.', heroStart: 'Ты успеешь ', heroEnd: 'ответить всем?',
      lead: 'Узнай за несколько секунд, хватит ли времени на сообщения клиентов — и как изменится очередь за следующую неделю.',
      setupTitle: 'Твоя нагрузка', parameters: '4 параметра',
      dailyIncoming: 'Новых сообщений в день', unanswered: 'Уже ждут ответа', minutesPerReply: 'Минут на один ответ', dailyMinutes: 'Времени на ответы в день',
      incomingHint: 'Сколько сообщений требуют отдельного ответа', backlogHint: 'Текущая очередь без ответа', replyHint: 'Среднее время, которое ты действительно тратишь', timeHint: 'Без монтажа, звонков и других задач',
      itemUnit: 'шт.', minuteUnit: 'мин', hourUnit: 'ч', privacy: 'Данные остаются в браузере', reset: 'Сбросить пример', resetDone: 'Пример восстановлен ✓',
      resultsTitle: 'Результат на 7 дней', live: 'Расчёт при изменении данных', queueKicker: 'Останется без ответа через 7 дней',
      capacityLabel: 'ответов помещается в день', answeredLabel: 'ответов за следующие 7 дней',
      clear: 'Очередь будет разобрана', shrinking: 'Очередь сокращается', steady: 'Очередь не уменьшается', growing: 'Очередь растёт',
      clearOld: 'При этой нагрузке старая очередь будет разобрана, а новые сообщения обработаны.', clearNew: 'Ежедневного времени достаточно для обработки новых сообщений.',
      growingDetail: 'За неделю очередь увеличится на {messages}. Новых обращений больше, чем возможностей ответить.',
      shrinkingDetail: 'За неделю очередь уменьшится на {messages}, но полностью не исчезнет.',
      steadyDetail: 'Очередь останется на том же уровне: времени хватает на текущий поток, но не на старые сообщения.',
      actionHeading: 'Как разобрать очередь за 7 дней', additional: '+{time} в день',
      actionDetail: 'Нужно {required} в день вместо {current}. Это позволит обработать и новые сообщения, и текущую очередь при заданных допущениях.',
      impossibleHeading: 'Нагрузка превышает 24 часа в сутки', impossibleMain: 'Разобрать за 7 дней не получится',
      impossibleDetail: 'По расчёту нужно {required} в день вместо {current}. Это больше 24 часов: при заданном времени одного ответа такой сценарий для одного человека невозможен.',
      enoughHeading: 'Текущего времени достаточно', enoughMain: 'Дополнительное время не нужно', enoughOld: 'Старая очередь будет полностью разобрана не позже конца недели при заданном притоке.',
      enoughNew: 'На текущий входящий поток требуется {time} в день. {reserve}', reserve: 'Остаётся резерв {time}.', noReserve: 'Резерва времени нет.',
      chartHeading: 'Очередь по дням', chartHint: 'при неизменной нагрузке', chartTitle: 'Количество сообщений без ответа', chartDescription: 'Столбцы показывают остаток очереди в конце каждого из семи дней.',
      chartAria: 'Остаток сообщений по дням: {series}', chartDay: 'День {day}: без ответа — {messages}', shortDay: 'Д{day}',
      copy: 'Скопировать результат ↗', copyNote: 'Без прогнозов охватов и скрытых алгоритмов', copyDone: 'Результат скопирован ✓', copyFailed: 'Скопировать не удалось',
      methodHeading: 'Как считаем?',
      method: 'Каждый день к очереди прибавляются новые сообщения. Из неё вычитается столько ответов, сколько помещается в ежедневный бюджет времени. Формула: очередь завтра = максимум(0, очередь сегодня + новые сообщения − обработанные). Предполагаем одинаковый поток все 7 дней, включая выходные. Это сценарный расчёт, а не предсказание реального числа сообщений.',
      footer: 'Reply Capacity · Прототип одной функции. Все значения в примере условные.', footerPrivacy: 'Без аккаунтов, отслеживания и передачи данных на сервер.',
      messageForms: {one: 'сообщение', few: 'сообщения', many: 'сообщений', other: 'сообщения'}, replyForms: {one: 'ответ', few: 'ответа', many: 'ответов', other: 'ответа'},
      copyReport: 'Reply Capacity — сценарий на 7 дней\nВходящие: {incoming} в день\nУже ждут ответа: {backlog}\nВремя на ответ: {replyTime}\nБюджет времени в день: {budget}\nВместимость в день: {capacity}\nЧерез 7 дней останется: {queue}\nДополнительно для полной разгрузки за 7 дней, ежедневно: {extra}\nДопущение: одинаковая нагрузка ежедневно.',
      copyImpossible: 'Ограничение: требуется больше 24 часов в сутки; для одного человека сценарий невозможен.',
    },
    fr: {
      languageEn: 'Anglais', languageRu: 'Russe', languageFr: 'Français', languageDe: 'Allemand',
      pageTitle: 'Reply Capacity — le temps de répondre à tout le monde ?',
      description: 'Reply Capacity calcule votre charge de messages, les messages en attente sur sept jours et le temps quotidien supplémentaire nécessaire pour les traiter.',
      languageLabel: 'Langue de l’interface', tag: 'Sans inscription ni connexion aux réseaux sociaux',
      eyebrow: 'Une tâche. Une réponse claire.', heroStart: 'Aurez-vous le temps de ', heroEnd: 'répondre à tout le monde ?',
      lead: 'Découvrez en quelques secondes si vous avez le temps de répondre à vos clients et comment évoluera votre file de messages sur une semaine.',
      setupTitle: 'Votre charge de travail', parameters: '4 paramètres',
      dailyIncoming: 'Nouveaux messages par jour', unanswered: 'Messages en attente', minutesPerReply: 'Minutes par réponse', dailyMinutes: 'Temps de réponse quotidien',
      incomingHint: 'Messages nécessitant chacun une réponse', backlogHint: 'Vos messages actuellement sans réponse', replyHint: 'Le temps moyen que vous y consacrez réellement', timeHint: 'Hors montage, appels et autres tâches',
      itemUnit: 'msg', minuteUnit: 'min', hourUnit: 'h', privacy: 'Vos données restent dans ce navigateur', reset: 'Réinitialiser l’exemple', resetDone: 'Exemple rétabli ✓',
      resultsTitle: 'Les 7 prochains jours', live: 'Calcul actualisé à chaque saisie', queueKicker: 'Encore sans réponse après 7 jours',
      capacityLabel: 'capacité de réponse quotidienne', answeredLabel: 'réponses sur les 7 prochains jours',
      clear: 'Tous les messages seront traités', shrinking: 'La file d’attente diminue', steady: 'La file d’attente ne diminue pas', growing: 'La file d’attente augmente',
      clearOld: 'Avec cette charge, vous traiterez les messages en attente et les nouveaux messages.', clearNew: 'Votre temps quotidien suffit pour traiter les nouveaux messages.',
      growingDetail: 'La file d’attente augmentera de {messages} sur la semaine. Vous recevez plus de messages que vous ne pouvez en traiter.',
      shrinkingDetail: 'La file d’attente diminuera de {messages} sur la semaine, mais il restera des messages à traiter.',
      steadyDetail: 'La file d’attente restera stable : votre temps suffit pour les nouveaux messages, mais pas pour réduire le retard.',
      actionHeading: 'Tout traiter en 7 jours', additional: '+{time} par jour',
      actionDetail: 'Il faut {required} par jour au lieu de {current}. Selon ces hypothèses, cela permet de traiter les nouveaux messages et ceux déjà en attente.',
      impossibleHeading: 'La charge dépasse 24 heures par jour', impossibleMain: 'Impossible de tout traiter en 7 jours',
      impossibleDetail: 'Le calcul exige {required} par jour au lieu de {current}. C’est plus de 24 heures : à ce rythme de réponse, une seule personne ne peut pas traiter cette charge.',
      enoughHeading: 'Votre temps actuel suffit', enoughMain: 'Aucun temps supplémentaire nécessaire', enoughOld: 'Avec ce flux quotidien, tous les messages en attente seront traités d’ici la fin de la semaine.',
      enoughNew: 'Les nouveaux messages nécessitent {time} par jour. {reserve}', reserve: 'Il reste {time} de marge.', noReserve: 'Il ne reste aucune marge.',
      chartHeading: 'Messages en attente par jour', chartHint: 'à charge constante', chartTitle: 'Messages sans réponse', chartDescription: 'Les barres indiquent les messages en attente à la fin de chacun des sept jours.',
      chartAria: 'Messages en attente par jour : {series}', chartDay: 'Jour {day} : {messages} sans réponse', shortDay: 'J{day}',
      copy: 'Copier le résultat ↗', copyNote: 'Sans prévision d’audience ni algorithme caché', copyDone: 'Résultat copié ✓', copyFailed: 'Impossible de copier le résultat',
      methodHeading: 'Comment est-ce calculé ?',
      method: 'Chaque jour, les nouveaux messages rejoignent la file d’attente. Nous retirons autant de réponses que le temps quotidien le permet. Formule : file suivante = max(0, file actuelle + nouveaux messages − réponses envoyées). La charge reste constante pendant les 7 jours, week-end compris. Il s’agit d’un calcul de scénario, pas d’une prévision des futurs messages réels.',
      footer: 'Reply Capacity · Un prototype à usage unique. Les valeurs de l’exemple sont indicatives.', footerPrivacy: 'Sans compte, suivi ni transmission de données à un serveur.',
      messageForms: {one: 'message', other: 'messages'}, replyForms: {one: 'réponse', other: 'réponses'},
      copyReport: 'Reply Capacity — scénario sur 7 jours\nMessages reçus : {incoming} par jour\nEn attente : {backlog}\nTemps par réponse : {replyTime}\nTemps quotidien disponible : {budget}\nCapacité quotidienne : {capacity}\nSans réponse après 7 jours : {queue}\nTemps quotidien supplémentaire pour tout traiter en 7 jours : {extra}\nHypothèse : la même charge chaque jour.',
      copyImpossible: 'Limite : plus de 24 heures par jour sont nécessaires ; ce scénario est impossible pour une seule personne.',
    },
    de: {
      languageEn: 'Englisch', languageRu: 'Russisch', languageFr: 'Französisch', languageDe: 'Deutsch',
      pageTitle: 'Reply Capacity — genug Zeit, um allen zu antworten?',
      description: 'Reply Capacity berechnet Ihre Nachrichtenlast, den Rückstand nach sieben Tagen und die zusätzliche tägliche Zeit zum Abbau.',
      languageLabel: 'Sprache der Benutzeroberfläche', tag: 'Ohne Registrierung oder verknüpfte Social-Media-Konten',
      eyebrow: 'Eine Aufgabe. Eine klare Antwort.', heroStart: 'Haben Sie Zeit, ', heroEnd: 'allen zu antworten?',
      lead: 'Finden Sie in wenigen Sekunden heraus, ob Ihre Zeit für Kundennachrichten reicht und wie sich Ihr Rückstand in der nächsten Woche entwickelt.',
      setupTitle: 'Ihre Arbeitslast', parameters: '4 Parameter',
      dailyIncoming: 'Neue Nachrichten pro Tag', unanswered: 'Wartende Nachrichten', minutesPerReply: 'Minuten pro Antwort', dailyMinutes: 'Tägliche Zeit für Antworten',
      incomingHint: 'Nachrichten, die jeweils eine Antwort benötigen', backlogHint: 'Ihre derzeit unbeantworteten Nachrichten', replyHint: 'Die Zeit, die Sie im Durchschnitt tatsächlich benötigen', timeHint: 'Ohne Schnitt, Anrufe und andere Aufgaben',
      itemUnit: 'Stk.', minuteUnit: 'Min.', hourUnit: 'Std.', privacy: 'Ihre Daten bleiben in diesem Browser', reset: 'Beispiel zurücksetzen', resetDone: 'Beispiel wiederhergestellt ✓',
      resultsTitle: 'Die nächsten 7 Tage', live: 'Berechnung bei jeder Änderung', queueKicker: 'Nach 7 Tagen noch unbeantwortet',
      capacityLabel: 'tägliche Antwortkapazität', answeredLabel: 'Antworten in den nächsten 7 Tagen',
      clear: 'Der Rückstand wird abgebaut', shrinking: 'Der Rückstand nimmt ab', steady: 'Der Rückstand nimmt nicht ab', growing: 'Der Rückstand wächst',
      clearOld: 'Bei dieser Arbeitslast bauen Sie den Rückstand ab und bearbeiten neue Nachrichten.', clearNew: 'Ihre tägliche Zeit reicht für neue Nachrichten aus.',
      growingDetail: 'Der Rückstand wächst in einer Woche um {messages}. Es kommen mehr Nachrichten an, als Sie beantworten können.',
      shrinkingDetail: 'Der Rückstand sinkt in einer Woche um {messages}, wird aber nicht vollständig abgebaut.',
      steadyDetail: 'Der Rückstand bleibt gleich: Ihre Zeit reicht für neue Nachrichten, aber nicht zum Abbau der wartenden Nachrichten.',
      actionHeading: 'Rückstand in 7 Tagen abbauen', additional: '+{time} pro Tag',
      actionDetail: 'Sie benötigen {required} pro Tag statt {current}. Unter diesen Annahmen reicht das für neue Nachrichten und den bestehenden Rückstand.',
      impossibleHeading: 'Die Arbeitslast übersteigt 24 Stunden pro Tag', impossibleMain: 'Abbau in 7 Tagen nicht möglich',
      impossibleDetail: 'Die Berechnung erfordert {required} pro Tag statt {current}. Das sind mehr als 24 Stunden: Bei dieser Antwortdauer kann eine Person diese Arbeitslast nicht bewältigen.',
      enoughHeading: 'Ihre derzeitige Zeit reicht aus', enoughMain: 'Keine zusätzliche Zeit nötig', enoughOld: 'Bei diesem täglichen Eingang wird der Rückstand bis zum Ende der Woche vollständig abgebaut.',
      enoughNew: 'Neue Nachrichten benötigen {time} pro Tag. {reserve}', reserve: 'Es bleiben {time} als Reserve.', noReserve: 'Es bleibt keine Zeitreserve.',
      chartHeading: 'Rückstand pro Tag', chartHint: 'bei gleichbleibender Arbeitslast', chartTitle: 'Unbeantwortete Nachrichten', chartDescription: 'Die Balken zeigen den Rückstand am Ende jedes der sieben Tage.',
      chartAria: 'Täglicher Rückstand: {series}', chartDay: 'Tag {day}: {messages} unbeantwortet', shortDay: 'T{day}',
      copy: 'Ergebnis kopieren ↗', copyNote: 'Ohne Reichweitenprognosen oder versteckte Algorithmen', copyDone: 'Ergebnis kopiert ✓', copyFailed: 'Ergebnis konnte nicht kopiert werden',
      methodHeading: 'Wie wird das berechnet?',
      method: 'Jeden Tag kommen neue Nachrichten zur Warteschlange hinzu. Wir ziehen so viele Antworten ab, wie in Ihr tägliches Zeitbudget passen. Formel: nächste Warteschlange = max(0, aktuelle Warteschlange + neue Nachrichten − gesendete Antworten). Die Arbeitslast bleibt an allen 7 Tagen gleich, auch am Wochenende. Dies ist eine Szenarioberechnung, keine Vorhersage tatsächlich eingehender Nachrichten.',
      footer: 'Reply Capacity · Ein Prototyp für eine Aufgabe. Alle Beispielwerte dienen der Veranschaulichung.', footerPrivacy: 'Ohne Konten, Tracking oder Datenübertragung an einen Server.',
      messageForms: {one: 'Nachricht', other: 'Nachrichten'}, replyForms: {one: 'Antwort', other: 'Antworten'},
      copyReport: 'Reply Capacity — 7-Tage-Szenario\nEingang: {incoming} pro Tag\nWartend: {backlog}\nZeit pro Antwort: {replyTime}\nTägliches Zeitbudget: {budget}\nTägliche Kapazität: {capacity}\nNach 7 Tagen unbeantwortet: {queue}\nZusätzliche tägliche Zeit für den Abbau in 7 Tagen: {extra}\nAnnahme: jeden Tag die gleiche Arbeitslast.',
      copyImpossible: 'Grenze: Es werden mehr als 24 Stunden pro Tag benötigt; dieses Szenario ist für eine Person unmöglich.',
    },
  };
  const supported = Object.keys(dictionaries);
  const isSupported = value => supported.includes(value);
  let language = 'en';
  let numbers;
  let plurals;
  function setLanguage(value) {
    language = isSupported(value) ? value : 'en';
    numbers = new Intl.NumberFormat(language);
    plurals = new Intl.PluralRules(language);
  }
  function t(key, params = {}) {
    const template = dictionaries[language][key];
    if (typeof template !== 'string') throw new Error(`Unknown translation: ${key}`);
    return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? `{${name}}`));
  }
  function count(n, key = 'messageForms') {
    const forms = dictionaries[language][key];
    return `${numbers.format(n)} ${forms[plurals.select(n)] || forms.other}`;
  }
  function time(n) {
    const minutes = `${numbers.format(n % 60)} ${t('minuteUnit')}`;
    return n >= 60 ? `${numbers.format(Math.floor(n / 60))} ${t('hourUnit')}${n % 60 ? ' ' + minutes : ''}` : minutes;
  }
  setLanguage('en');
  root.ReplyCapacityI18n = { dictionaries, supported, isSupported, setLanguage, t, count, time,
    number: n => numbers.format(n), get language() { return language; } };
})(typeof globalThis !== 'undefined' ? globalThis : this);
