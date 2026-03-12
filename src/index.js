require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');

const { startScheduler } = require('./scheduler');
const { getWeeklyActivity, calculateProjectStatus, getWeekRange } = require('./github');
const { buildWeeklyReportEmbed } = require('./embeds');
const { askAI, loadHistory } = require('./ai');

// ── Discord Client ─────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ── Slash Commands ─────────────────────────────────────────────────────────
const commands = [
  new SlashCommandBuilder()
    .setName('weekly-report')
    .setDescription('Δημοσιεύει αμέσως την εβδομαδιαία αναφορά προόδου'),

  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Εμφανίζει το τρέχον status του project'),

  new SlashCommandBuilder()
    .setName('check-commits')
    .setDescription('Ελέγχει ποια μέλη δεν έχουν κάνει commits αυτή την εβδομάδα'),

  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ρώτα το AI για το project')
    .addStringOption((opt) =>
      opt.setName('question')
        .setDescription('Η ερώτησή σου (π.χ. "τι έκανε ο Γιώργος αυτή την εβδομάδα;")')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('history')
    .setDescription('Εμφανίζει το ιστορικό προόδου των τελευταίων εβδομάδων'),
].map((cmd) => cmd.toJSON());

// ── Cache για GitHub data ──────────────────────────────────────────────────
let cachedWeekData = null;
let cacheTime = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 λεπτά

async function getWeekDataCached() {
  if (cachedWeekData && cacheTime && Date.now() - cacheTime < CACHE_TTL) {
    return cachedWeekData;
  }
  const members = await getWeeklyActivity();
  const projectStatus = calculateProjectStatus(members);
  const weekRange = getWeekRange();
  cachedWeekData = { members, projectStatus, weekRange };
  cacheTime = Date.now();
  return cachedWeekData;
}

// ── Bot Ready ──────────────────────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`\n✅ Bot online: ${client.user.tag}`);
  console.log(`📡 Servers: ${client.guilds.cache.size}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    const guilds = client.guilds.cache.map((g) => g.id);
    for (const guildId of guilds) {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, guildId),
        { body: commands }
      );
    }
    console.log('✅ Slash commands registered.\n');
  } catch (err) {
    console.error('❌ Slash commands error:', err);
  }

  startScheduler(client);
});

// ── @Mention Handler ───────────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  const question = message.content.replace(/<@!?\d+>/g, '').trim();

  if (!question) {
    return message.reply(
      '👋 Γεια! Ρώτα με οτιδήποτε για το project!\n' +
      'π.χ. `@EcoCity Status Bot τι έκανε η ομάδα αυτή την εβδομάδα;`'
    );
  }

  await message.channel.sendTyping();

  try {
    const weekData = await getWeekDataCached();
    const answer = await askAI(question, weekData);

    if (answer.length <= 1900) {
      await message.reply(answer);
    } else {
      const chunks = answer.match(/.{1,1900}/gs) || [];
      for (const chunk of chunks) {
        await message.channel.send(chunk);
      }
    }
  } catch (err) {
    console.error('[Mention] Error:', err);
    await message.reply('❌ Κάτι πήγε στραβά. Δοκίμασε ξανά σε λίγο.');
  }
});

// ── Slash Command Handler ──────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'weekly-report') {
    await interaction.deferReply();
    try {
      const weekData = await getWeekDataCached();
      const embed = buildWeeklyReportEmbed(weekData.members, weekData.projectStatus, weekData.weekRange);
      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply('❌ Σφάλμα κατά την ανάκτηση δεδομένων από GitHub.');
    }
  }

  if (commandName === 'status') {
    await interaction.deferReply({ ephemeral: true });
    try {
      const { members, projectStatus } = await getWeekDataCached();
      const lines = members.map(
        (m) => `${m.emoji} **${m.name}** — ${m.commits} commits — ${m.hasActivity ? '✅ Active' : '❌ No commits'}`
      );
      await interaction.editReply(
        `**Project Status:** ${projectStatus.emoji} ${projectStatus.label}\n\n${lines.join('\n')}`
      );
    } catch {
      await interaction.editReply('❌ Δεν ήταν δυνατή η σύνδεση με το GitHub.');
    }
  }

  if (commandName === 'check-commits') {
    await interaction.deferReply({ ephemeral: true });
    try {
      const { members } = await getWeekDataCached();
      const inactive = members.filter((m) => !m.hasActivity);
      if (inactive.length === 0) {
        await interaction.editReply('✅ Όλα τα μέλη έχουν commits αυτή την εβδομάδα!');
      } else {
        const names = inactive.map((m) => `• ${m.emoji} ${m.name}`).join('\n');
        await interaction.editReply(`⚠️ Χωρίς commits αυτή την εβδομάδα:\n\n${names}`);
      }
    } catch {
      await interaction.editReply('❌ Σφάλμα σύνδεσης με GitHub.');
    }
  }

  if (commandName === 'ask') {
    await interaction.deferReply();
    const question = interaction.options.getString('question');
    try {
      const weekData = await getWeekDataCached();
      const answer = await askAI(question, weekData);
      const reply = answer.length <= 1850 ? answer : answer.slice(0, 1850) + '…';
      await interaction.editReply(`🤖 **${question}**\n\n${reply}`);
    } catch {
      await interaction.editReply('❌ Σφάλμα AI. Δοκίμασε ξανά.');
    }
  }

  if (commandName === 'history') {
    await interaction.deferReply({ ephemeral: true });
    const history = loadHistory();

    if (history.length === 0) {
      return interaction.editReply('📭 Δεν υπάρχει ιστορικό ακόμα. Θα αρχίσει από τη Δευτέρα!');
    }

    const lines = history.slice(-8).map((w) => {
      const e = w.projectStatus?.label === 'ON TRACK' ? '🟢' : w.projectStatus?.label === 'AT RISK' ? '🟡' : '🔴';
      const summary = w.members.map((m) => `${m.name.split(' ')[0]}: ${m.commits}c`).join(' | ');
      return `**${w.week}** ${e}\n${summary}`;
    });

    await interaction.editReply(`📊 **Ιστορικό Προόδου**\n\n${lines.join('\n\n')}`);
  }
});

// ── Login ──────────────────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('❌ Login failed:', err.message);
  process.exit(1);
});
