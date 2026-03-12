const { EmbedBuilder } = require('discord.js');

// ── Παραβιάσεις που παρακολουθούμε ────────────────────────────────────────
// Βασισμένο στο επίσημο ΚΑΝΟΝΕΣ doc του EcoCity Tracker

const RULES = {
  NO_DAILY_COMMIT: {
    id: 'NO_DAILY_COMMIT',
    title: '⛔ Παράλειψη Daily Commit/Push',
    description: 'Δεν υπάρχει push σε μέρα εργασίας.',
    consequences: [
      '1η φορά: Ειδοποίηση από τον @Lead Dev',
      '2η φορά: Αφαίρεση tasks & μείωση ποσοστού συνεισφοράς',
    ],
  },
  MISSING_MIDWEEK: {
    id: 'MISSING_MIDWEEK',
    title: '⚠️ Απουσία Commits (Μέσα εβδομάδα)',
    description: 'Τετάρτη μεσημέρι και ακόμα δεν υπάρχουν commits.',
    consequences: ['Ειδοποίηση στους leaders', 'Επόμενη μέρα = Catch-up Day αν δεν διορθωθεί'],
  },
  WEEK_BEHIND: {
    id: 'WEEK_BEHIND',
    title: '⛔ Καθυστέρηση Εβδομαδιαίου Παραδοτέου',
    description: 'Το εβδομαδιαίο task δεν έχει ολοκληρωθεί.',
    consequences: [
      'Επόμενη μέρα = Catch-up Day (παγώνουν όλα τα άλλα)',
      'Χάνεται ο buffer χρόνος πριν την παράδοση 22/4',
    ],
  },
  LOW_ACTIVITY: {
    id: 'LOW_ACTIVITY',
    title: '📉 Χαμηλή Δραστηριότητα',
    description: 'Λιγότερα από 3 commits ολόκληρη την εβδομάδα.',
    consequences: ['Καταγραφή στο Progress Log', 'Ειδοποίηση leaders'],
  },
};

// ── Violation tracker (αποθηκεύει ιστορικό παραβιάσεων ανά μέλος) ─────────
const violationCount = {};

function incrementViolation(memberName, ruleId) {
  const key = `${memberName}:${ruleId}`;
  violationCount[key] = (violationCount[key] || 0) + 1;
  return violationCount[key];
}

function getViolationCount(memberName, ruleId) {
  return violationCount[`${memberName}:${ruleId}`] || 0;
}

// ── Εβδομαδιαίο χρονοδιάγραμμα (από το document) ─────────────────────────
const SCHEDULE = [
  { week: 1, dates: '11/03 - 16/03', tasks: 'Setup, GitHub Repo & Wireframes' },
  { week: 2, dates: '18/03 - 27/03', tasks: 'Database Schema, Login/Register & HTML Structure' },
  { week: 3, dates: '01/04 - 07/04', tasks: 'PHP APIs (get_reports, submit_report) & Leaflet.js' },
  { week: 4, dates: '09/04 - 14/04', tasks: 'Dashboard (Chart.js), Admin Panel & Security' },
  { week: 5, dates: '16/04 - 19/04', tasks: 'Final Testing, Cleanup & Documentation' },
];

function getCurrentWeekPlan() {
  const now = new Date();
  const deadlineDate = new Date('2026-04-22');
  const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  // Βρες ποια εβδομάδα είμαστε βάσει ημερομηνίας
  const weekRanges = [
    { week: 1, start: new Date('2026-03-11'), end: new Date('2026-03-16') },
    { week: 2, start: new Date('2026-03-18'), end: new Date('2026-03-27') },
    { week: 3, start: new Date('2026-04-01'), end: new Date('2026-04-07') },
    { week: 4, start: new Date('2026-04-09'), end: new Date('2026-04-14') },
    { week: 5, start: new Date('2026-04-16'), end: new Date('2026-04-19') },
  ];

  const current = weekRanges.find((w) => now >= w.start && now <= w.end);
  const plan = current ? SCHEDULE.find((s) => s.week === current.week) : null;

  return { plan, daysLeft };
}

// ── Embed Builders ─────────────────────────────────────────────────────────

function buildViolationEmbed(member, rule, count, extraNote = '') {
  const isSecondOffense = count >= 2;

  return new EmbedBuilder()
    .setTitle(rule.title)
    .setDescription(
      `**Μέλος:** ${member.emoji} ${member.name}\n` +
      `**Ρόλος:** ${member.role}\n` +
      `**GitHub:** \`${member.github}\`\n\n` +
      `${rule.description}\n\n` +
      (extraNote ? `📝 ${extraNote}\n\n` : '') +
      `**⚖️ Συνέπεια (${count}η φορά):**\n` +
      `${rule.consequences[Math.min(count - 1, rule.consequences.length - 1)]}`
    )
    .setColor(isSecondOffense ? 0xed4245 : 0xfee75c)
    .setTimestamp()
    .setFooter({ text: 'EcoCity Tracker · Rule Enforcement System' });
}

function buildDailyCheckEmbed(members, allGood) {
  const { plan, daysLeft } = getCurrentWeekPlan();

  const embed = new EmbedBuilder()
    .setTitle(allGood ? '✅ Daily Check — Όλα Καλά!' : '⚠️ Daily Check — Υπάρχουν Προβλήματα')
    .setColor(allGood ? 0x57f287 : 0xed4245)
    .setTimestamp()
    .setFooter({ text: `EcoCity Tracker · ${daysLeft} μέρες μέχρι την παράδοση (22/4)` });

  if (plan) {
    embed.setDescription(
      `📅 **Τρέχουσα Εβδομάδα ${plan.week}** (${plan.dates})\n` +
      `🎯 **Tasks:** ${plan.tasks}\n` +
      `⏳ **Μέρες μέχρι παράδοση:** ${daysLeft}`
    );
  }

  for (const m of members) {
    const status = m.hasActivity
      ? `✅ ${m.commits} commits αυτή την εβδομάδα`
      : `❌ **0 commits** — Παράβαση κανόνα!`;

    embed.addFields({
      name: `${m.emoji} ${m.name}`,
      value: `${status}\n${m.commitMessages.length > 0 ? m.commitMessages.slice(0, 2).map((c) => `\`${c.slice(0, 50)}\``).join('\n') : ''}`,
      inline: true,
    });
  }

  return embed;
}

function buildDeadlineWarningEmbed(daysLeft) {
  let urgency, color;
  if (daysLeft <= 3) { urgency = '🔴 ΚΡΙΤΙΚΟ'; color = 0xed4245; }
  else if (daysLeft <= 7) { urgency = '🟡 ΠΡΟΣΟΧΗ'; color = 0xfee75c; }
  else { urgency = '🟢 ON TRACK'; color = 0x57f287; }

  const { plan } = getCurrentWeekPlan();

  return new EmbedBuilder()
    .setTitle(`${urgency} — ${daysLeft} μέρες μέχρι την παράδοση!`)
    .setDescription(
      `**🏁 Τελική Παράδοση:** Τετάρτη 22 Απριλίου 2026 — v1.0\n\n` +
      (plan
        ? `**📋 Τρέχον Task:** Εβδ. ${plan.week} — ${plan.tasks}`
        : `**📋 Βρισκόμαστε εκτός χρονοδιαγράμματος!**`)
    )
    .setColor(color)
    .setTimestamp();
}

module.exports = {
  RULES,
  SCHEDULE,
  incrementViolation,
  getViolationCount,
  getCurrentWeekPlan,
  buildViolationEmbed,
  buildDailyCheckEmbed,
  buildDeadlineWarningEmbed,
};
