const cron = require('node-cron');
const { getWeeklyActivity, calculateProjectStatus, getWeekRange } = require('./github');
const {
  buildWeeklyReportEmbed,
  buildFridayReminderEmbed,
  buildRiskAlert,
} = require('./embeds');
const {
  RULES,
  incrementViolation,
  buildViolationEmbed,
  buildDailyCheckEmbed,
  buildDeadlineWarningEmbed,
  getCurrentWeekPlan,
} = require('./rules');
const { addWeekToHistory } = require('./ai');

// ── Leaders που παίρνουν DM για παραβιάσεις ───────────────────────────────
// LEADER_DISCORD_ID   = @george.leo_vento (Project Leader)
// COLEADER_DISCORD_ID = @giorgos21 (Co-Leader)
const LEADER_IDS = [
  process.env.LEADER_DISCORD_ID,
  process.env.COLEADER_DISCORD_ID,
];

async function dmLeaders(client, content) {
  for (const leaderId of LEADER_IDS) {
    if (!leaderId) continue;
    try {
      const user = await client.users.fetch(leaderId);
      if (typeof content === 'string') {
        await user.send(content);
      } else {
        await user.send({ embeds: [content] });
      }
    } catch (err) {
      console.error(`[DM] Failed for ${leaderId}:`, err.message);
    }
  }
}

function leaderMentions() {
  return LEADER_IDS.filter(Boolean).map((id) => `<@${id}>`).join(' ');
}

// ── startScheduler ─────────────────────────────────────────────────────────
function startScheduler(client) {
  console.log('[Scheduler] Starting all cron jobs...');

  // ΔΕΥΤΕΡΑ 09:00 — Weekly Report
  cron.schedule('0 9 * * 1', async () => {
    await postWeeklyReport(client);
  }, { timezone: 'Europe/Athens' });

  // ΤΡΙΤΗ & ΠΕΜΠΤΗ 10:00 — Daily commit check
  cron.schedule('0 10 * * 2,4', async () => {
    await dailyCommitCheck(client);
  }, { timezone: 'Europe/Athens' });

  // ΤΕΤΑΡΤΗ 12:00 — Mid-week check
  cron.schedule('0 12 * * 3', async () => {
    await midWeekCheck(client);
  }, { timezone: 'Europe/Athens' });

  // ΠΑΡΑΣΚΕΥΗ 16:00 — Reminder
  cron.schedule('0 16 * * 5', async () => {
    await postFridayReminder(client);
  }, { timezone: 'Europe/Athens' });

  // ΚΑΘΕ ΜΕΡΑ 09:00 — Deadline countdown (τελευταίες 7 μέρες)
  cron.schedule('0 9 * * *', async () => {
    const { daysLeft } = getCurrentWeekPlan();
    if (daysLeft <= 7) await postDeadlineWarning(client, daysLeft);
  }, { timezone: 'Europe/Athens' });

  console.log('[Scheduler] ✅ All jobs registered:');
  console.log('  • Δευτέρα       09:00 → Weekly Report');
  console.log('  • Τρίτη/Πέμπτη 10:00 → Daily Commit Check');
  console.log('  • Τετάρτη      12:00 → Mid-week Check + DM Leaders');
  console.log('  • Παρασκευή    16:00 → Reminder');
  console.log('  • Κάθε μέρα    09:00 → Deadline Countdown (τελ. 7 μέρες)');
}

// ── WEEKLY REPORT ──────────────────────────────────────────────────────────
async function postWeeklyReport(client) {
  try {
    const channel = await client.channels.fetch(process.env.WEEKLY_CHANNEL_ID);
    const members = await getWeeklyActivity();
    const projectStatus = calculateProjectStatus(members);
    const weekRange = getWeekRange();

    const embed = buildWeeklyReportEmbed(members, projectStatus, weekRange);
    await channel.send({
      content: `${leaderMentions()} 📅 Εβδομαδιαία Αναφορά Προόδου`,
      embeds: [embed],
    });

    addWeekToHistory({ members, projectStatus, weekRange });

    if (projectStatus.label !== 'ON TRACK') {
      const inactive = members.filter((m) => !m.hasActivity);
      const alertChannel = await client.channels.fetch(process.env.ALERTS_CHANNEL_ID);
      const riskEmbed = buildRiskAlert(projectStatus, inactive);
      await alertChannel.send({ embeds: [riskEmbed] });
      await dmLeaders(client, riskEmbed);
    }

    console.log('[Report] ✅ Weekly report posted.');
  } catch (err) {
    console.error('[Report] ❌', err.message);
  }
}

// ── DAILY COMMIT CHECK ────────────────────────────────────────────────────
async function dailyCommitCheck(client) {
  try {
    const members = await getWeeklyActivity();
    const allGood = members.every((m) => m.hasActivity);
    const alertChannel = await client.channels.fetch(process.env.ALERTS_CHANNEL_ID);

    const checkEmbed = buildDailyCheckEmbed(members, allGood);
    await alertChannel.send({ embeds: [checkEmbed] });

    for (const member of members.filter((m) => !m.hasActivity)) {
      const count = incrementViolation(member.name, RULES.NO_DAILY_COMMIT.id);
      const violationEmbed = buildViolationEmbed(member, RULES.NO_DAILY_COMMIT, count);

      await alertChannel.send({
        content: `<@${member.discordId}> ${leaderMentions()}`,
        embeds: [violationEmbed],
      });

      await dmLeaders(
        client,
        `🚨 **Παράβαση** — ${member.name} (${count}η φορά)\n` +
        `0 commits αυτή την εβδομάδα.\n` +
        `🔗 https://github.com/${process.env.GITHUB_REPO}/commits?author=${member.github}`
      );
    }
  } catch (err) {
    console.error('[DailyCheck] ❌', err.message);
  }
}

// ── MID-WEEK CHECK ────────────────────────────────────────────────────────
async function midWeekCheck(client) {
  try {
    const members = await getWeeklyActivity();
    const inactive = members.filter((m) => !m.hasActivity);
    const lowActivity = members.filter((m) => m.hasActivity && m.commits < 3);
    const alertChannel = await client.channels.fetch(process.env.ALERTS_CHANNEL_ID);

    const checkEmbed = buildDailyCheckEmbed(members, inactive.length === 0);
    await alertChannel.send({
      content: `📊 **Mid-week Check** — ${leaderMentions()}`,
      embeds: [checkEmbed],
    });

    for (const member of inactive) {
      const count = incrementViolation(member.name, RULES.MISSING_MIDWEEK.id);
      const embed = buildViolationEmbed(member, RULES.MISSING_MIDWEEK, count, 'Τετάρτη μεσημέρι και 0 commits!');
      await alertChannel.send({ content: `<@${member.discordId}>`, embeds: [embed] });
      await dmLeaders(client, embed);
    }

    for (const member of lowActivity) {
      const count = incrementViolation(member.name, RULES.LOW_ACTIVITY.id);
      const embed = buildViolationEmbed(member, RULES.LOW_ACTIVITY, count, `Μόνο ${member.commits} commits μέχρι τώρα.`);
      await alertChannel.send({ embeds: [embed] });
      await dmLeaders(client, embed);
    }

    // DM summary στους leaders
    await dmLeaders(
      client,
      `📋 **Mid-week Summary**\n\n` +
      members.map((m) => `${m.emoji} ${m.name}: ${m.commits} commits ${m.hasActivity ? '✅' : '❌'}`).join('\n') +
      `\n\n⚠️ Inactive: ${inactive.length} | 📉 Low activity: ${lowActivity.length}`
    );

    console.log('[MidWeek] ✅ Done.');
  } catch (err) {
    console.error('[MidWeek] ❌', err.message);
  }
}

// ── FRIDAY REMINDER ───────────────────────────────────────────────────────
async function postFridayReminder(client) {
  try {
    const channel = await client.channels.fetch(process.env.WEEKLY_CHANNEL_ID);
    const { daysLeft } = getCurrentWeekPlan();
    const reminder = buildFridayReminderEmbed();
    await channel.send({
      content: `⏰ ${leaderMentions()} — **${daysLeft} μέρες** μέχρι την παράδοση!`,
      embeds: [reminder],
    });
    console.log('[Reminder] ✅ Done.');
  } catch (err) {
    console.error('[Reminder] ❌', err.message);
  }
}

// ── DEADLINE WARNING ──────────────────────────────────────────────────────
async function postDeadlineWarning(client, daysLeft) {
  try {
    const channel = await client.channels.fetch(process.env.WEEKLY_CHANNEL_ID);
    const warningEmbed = buildDeadlineWarningEmbed(daysLeft);
    await channel.send({
      content: `⚠️ ${leaderMentions()} **DEADLINE ALERT**`,
      embeds: [warningEmbed],
    });

    if (daysLeft <= 3) {
      await dmLeaders(
        client,
        `🔴 **ΚΡΙΤΙΚΟ!** Απομένουν **${daysLeft} μέρες** μέχρι την τελική παράδοση!\n🏁 EcoCity Tracker v1.0 — 22 Απριλίου 2026`
      );
    }
  } catch (err) {
    console.error('[Deadline] ❌', err.message);
  }
}

async function triggerManualReport(client) {
  await postWeeklyReport(client);
}

module.exports = { startScheduler, triggerManualReport };
