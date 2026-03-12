const { EmbedBuilder } = require('discord.js');

/**
 * Φτιάχνει το κυρίως weekly report embed
 */
function buildWeeklyReportEmbed(members, projectStatus, weekRange) {
  const embed = new EmbedBuilder()
    .setTitle('📅  ΕΒΔΟΜΑΔΙΑΙΑ ΑΝΑΦΟΡΑ ΠΡΟΟΔΟΥ')
    .setDescription(
      `**Περίοδος:** ${weekRange}\n**Status Project:** ${projectStatus.emoji} **${projectStatus.label}**`
    )
    .setColor(getStatusColor(projectStatus.label))
    .setTimestamp()
    .setFooter({ text: `${process.env.PROJECT_NAME} • Auto-generated από GitHub` });

  for (const member of members) {
    const githubStatus = member.hasActivity ? '✅ Verified' : '❌ No Commits';
    const taskStatus = inferTaskStatus(member);

    const tasks =
      member.commitMessages.length > 0
        ? member.commitMessages.map((m) => `\`${truncate(m, 50)}\``).join('\n')
        : '_Δεν βρέθηκαν commits αυτή την εβδομάδα_';

    const issues =
      member.openIssues.length > 0
        ? member.openIssues.map((i) => `• ${truncate(i, 45)}`).join('\n')
        : '—';

    embed.addFields({
      name: `${member.emoji}  ${member.name}  ·  *${member.role}*`,
      value: [
        `**GitHub Activity:** ${githubStatus}  ·  ${member.commits} commits`,
        `**Κατάσταση:** ${taskStatus}`,
        `**Πρόσφατα commits:**\n${tasks}`,
        `**Open Issues:** ${issues}`,
      ].join('\n'),
    });
  }

  embed.addFields({
    name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    value: '🛡️  **ΠΑΡΑΤΗΡΗΣΕΙΣ ΕΠΟΠΤΕΙΑΣ** *(Auto-generated)*',
  });

  return embed;
}

/**
 * Φτιάχνει alert embed για inactive member
 */
function buildInactiveAlert(member) {
  return new EmbedBuilder()
    .setTitle('⚠️  Δεν εντοπίστηκαν commits')
    .setDescription(
      `<@${member.discordId}> δεν έχει κάνει commits αυτή την εβδομάδα!\n\n` +
      `**Ρόλος:** ${member.role}\n` +
      `Παρακαλώ ενημέρωσε την ομάδα για την πρόοδό σου ή σύγχρονίσε το GitHub.`
    )
    .setColor(0xed4245)
    .setTimestamp();
}

/**
 * Φτιάχνει reminder embed (Παρασκευή)
 */
function buildFridayReminderEmbed() {
  return new EmbedBuilder()
    .setTitle('📋  Reminder — Εβδομαδιαία Αναφορά')
    .setDescription(
      '⏰ Υπενθύμιση: Σήμερα είναι **Παρασκευή**!\n\n' +
      'Βεβαιωθείτε ότι:\n' +
      '• ✅ Τα commits σας είναι pushed στο GitHub\n' +
      '• ✅ Τα open issues είναι ενημερωμένα\n' +
      '• ✅ Οποιαδήποτε blocker έχει αναφερθεί\n\n' +
      '_Η αυτόματη εβδομαδιαία αναφορά θα δημοσιευτεί τη **Δευτέρα πρωί**._'
    )
    .setColor(0xfee75c)
    .setTimestamp();
}

/**
 * Φτιάχνει AT RISK / DELAYED ping embed
 */
function buildRiskAlert(projectStatus, inactiveMembers) {
  const mentions = inactiveMembers.map((m) => `<@${m.discordId}>`).join(', ');

  return new EmbedBuilder()
    .setTitle(`${projectStatus.emoji}  Project Status: ${projectStatus.label}`)
    .setDescription(
      `**Το project βρίσκεται σε ${projectStatus.label}!**\n\n` +
      `Μέλη χωρίς activity: ${mentions}\n\n` +
      `Παρακαλώ ενημερώστε το GitHub ή επικοινωνήστε με τον overseer.`
    )
    .setColor(projectStatus.label === 'AT RISK' ? 0xfee75c : 0xed4245)
    .setTimestamp();
}

// ── Helpers ────────────────────────────────────────────────

function inferTaskStatus(member) {
  if (!member.hasActivity) return '⚪ NOT STARTED / Αδρανές';
  if (member.commits >= 5) return '✅ COMPLETED / Ενεργό';
  return '🔵 IN PROGRESS';
}

function getStatusColor(label) {
  if (label === 'ON TRACK') return 0x57f287;
  if (label === 'AT RISK') return 0xfee75c;
  return 0xed4245;
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

module.exports = {
  buildWeeklyReportEmbed,
  buildInactiveAlert,
  buildFridayReminderEmbed,
  buildRiskAlert,
};
