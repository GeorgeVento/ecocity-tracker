const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

/**
 * Παίρνει commits για έναν user μέσα στην τρέχουσα εβδομάδα
 */
async function getCommitsThisWeek(username) {
  const since = getWeekStart().toISOString();
  const repo = process.env.GITHUB_REPO;

  try {
    const { data } = await axios.get(
      `${GITHUB_API}/repos/${repo}/commits`,
      {
        headers,
        params: { author: username, since, per_page: 100 },
      }
    );
    return data;
  } catch (err) {
    console.error(`[GitHub] Error fetching commits for ${username}:`, err.message);
    return [];
  }
}

/**
 * Παίρνει τα open issues/PRs που έχει assigned ένας user
 */
async function getOpenIssues(username) {
  const repo = process.env.GITHUB_REPO;
  try {
    const { data } = await axios.get(
      `${GITHUB_API}/repos/${repo}/issues`,
      {
        headers,
        params: { assignee: username, state: 'open', per_page: 10 },
      }
    );
    return data;
  } catch (err) {
    console.error(`[GitHub] Error fetching issues for ${username}:`, err.message);
    return [];
  }
}

/**
 * Παίρνει συνολική δραστηριότητα για όλα τα μέλη
 */
async function getWeeklyActivity() {
  const members = [
    {
      name: 'Γιώργος-Λεωνίδας Βεντουράτος',
      role: 'DB & Structure',
      emoji: '🟢',
      github: process.env.MEMBER_1_GITHUB,
      discordId: process.env.MEMBER_1_DISCORD_ID,
    },
    {
      name: 'Δήμος Χριστοδούλου',
      role: 'Backend & CSS',
      emoji: '🔵',
      github: process.env.MEMBER_2_GITHUB,
      discordId: process.env.MEMBER_2_DISCORD_ID,
    },
    {
      name: 'Γιώργος Παπαδάκης',
      role: 'JS & Analytics',
      emoji: '🟣',
      github: process.env.MEMBER_3_GITHUB,
      discordId: process.env.MEMBER_3_DISCORD_ID,
    },
  ];

  const results = await Promise.all(
    members.map(async (member) => {
      const commits = await getCommitsThisWeek(member.github);
      const issues = await getOpenIssues(member.github);

      const commitMessages = commits
        .slice(0, 5)
        .map((c) => c.commit.message.split('\n')[0]);

      return {
        ...member,
        commits: commits.length,
        commitMessages,
        openIssues: issues.map((i) => i.title),
        hasActivity: commits.length > 0,
      };
    })
  );

  return results;
}

/**
 * Υπολογίζει project status βάσει activity
 */
function calculateProjectStatus(members) {
  const inactive = members.filter((m) => !m.hasActivity).length;
  if (inactive === 0) return { emoji: '🟢', label: 'ON TRACK' };
  if (inactive === 1) return { emoji: '🟡', label: 'AT RISK' };
  return { emoji: '🔴', label: 'DELAYED' };
}

/**
 * Επιστρέφει την αρχή της τρέχουσας εβδομάδας (Δευτέρα)
 */
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Επιστρέφει formatted range εβδομάδας
 */
function getWeekRange() {
  const monday = getWeekStart();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d) =>
    d.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return `${fmt(monday)} — ${fmt(sunday)}`;
}

module.exports = {
  getWeeklyActivity,
  calculateProjectStatus,
  getWeekRange,
  getCommitsThisWeek,
};
