const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const HISTORY_FILE = path.join(__dirname, '../data/history.json');

// ── History (persistent JSON file) ────────────────────────────────────────

function loadHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(history) {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  // Κράτα μόνο τις τελευταίες 20 εβδομάδες
  const trimmed = history.slice(-20);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2));
}

function addWeekToHistory(weekData) {
  const history = loadHistory();
  history.push({
    week: weekData.weekRange,
    date: new Date().toISOString(),
    members: weekData.members.map((m) => ({
      name: m.name,
      commits: m.commits,
      commitMessages: m.commitMessages,
      openIssues: m.openIssues,
      hasActivity: m.hasActivity,
    })),
    projectStatus: weekData.projectStatus,
  });
  saveHistory(history);
}

// ── GitHub file fetcher (για code analysis) ───────────────────────────────

async function fetchRepoTree() {
  const repo = process.env.GITHUB_REPO;
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
  };

  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repo}/git/trees/HEAD?recursive=1`,
      { headers }
    );
    return data.tree
      .filter((f) => f.type === 'blob')
      .map((f) => f.path)
      .slice(0, 60); // max 60 αρχεία
  } catch (err) {
    console.error('[AI] Failed to fetch repo tree:', err.message);
    return [];
  }
}

async function fetchFileContent(filePath) {
  const repo = process.env.GITHUB_REPO;
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
  };

  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      { headers }
    );
    if (data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf8').slice(0, 3000);
    }
    return '';
  } catch {
    return '';
  }
}

// ── Main AI function ───────────────────────────────────────────────────────

async function askAI(question, currentWeekData) {
  const history = loadHistory();

  // Φτιάξε context από GitHub
  const repoFiles = await fetchRepoTree();

  // Αν ρωτάει για κώδικα, πάρε περιεχόμενο αρχείων
  let codeContext = '';
  const codeKeywords = ['κώδικ', 'αρχείο', 'file', 'function', 'code', 'bug', 'error', 'class', 'sql', 'css', 'js', 'html'];
  const asksAboutCode = codeKeywords.some((k) => question.toLowerCase().includes(k));

  if (asksAboutCode && repoFiles.length > 0) {
    // Πάρε τα πιο σχετικά αρχεία (μέχρι 3)
    const relevantFiles = repoFiles
      .filter((f) => !f.includes('node_modules') && !f.includes('.lock'))
      .slice(0, 3);

    for (const file of relevantFiles) {
      const content = await fetchFileContent(file);
      if (content) {
        codeContext += `\n\n--- Αρχείο: ${file} ---\n${content}`;
      }
    }
  }

  // Φτιάξε το system prompt
  const systemPrompt = `Είσαι ο AI assistant της ομάδας ανάπτυξης του project "EcoCity Tracker".
Βοηθάς την ομάδα να παρακολουθεί την πρόοδό της, αναλύεις κώδικα και προτείνεις βελτιώσεις.

ΜΕΛΗ ΟΜΑΔΑΣ:
- Γιώργος-Λεωνίδας Βεντουράτος (GitHub: GeorgeVento) → DB & Structure
- Δήμος Χριστοδούλου (GitHub: 54c4hf22jp-del) → Backend & CSS  
- Γιώργος Παπαδάκης (GitHub: giorgospap06) → JS & Analytics

GITHUB REPO: https://github.com/GeorgeVento/ecocity-tracker
ΑΡΧΕΙΑ REPO: ${repoFiles.join(', ') || 'Δεν βρέθηκαν'}

ΤΡΕΧΟΥΣΑ ΕΒΔΟΜΑΔΑ (${currentWeekData?.weekRange || 'N/A'}):
${currentWeekData?.members?.map((m) =>
  `- ${m.name}: ${m.commits} commits | ${m.hasActivity ? '✅ Ενεργός' : '❌ Αδρανής'}
   Commits: ${m.commitMessages.join(', ') || 'κανένα'}
   Open Issues: ${m.openIssues.join(', ') || 'κανένα'}`
).join('\n') || 'Δεν υπάρχουν δεδομένα'}

ΙΣΤΟΡΙΚΟ ΠΡΟΗΓΟΥΜΕΝΩΝ ΕΒΔΟΜΑΔΩΝ:
${history.length > 0
  ? history.slice(-5).map((w) =>
    `Εβδομάδα ${w.week}: Status ${w.projectStatus?.label} | ` +
    w.members.map((m) => `${m.name.split(' ')[0]}: ${m.commits} commits`).join(', ')
  ).join('\n')
  : 'Δεν υπάρχει ιστορικό ακόμα'}

${codeContext ? `ΣΧΕΤΙΚΟΣ ΚΩΔΙΚΑΣ:${codeContext}` : ''}

Απάντα στα Ελληνικά, με σαφήνεια και συντομία. Αν προτείνεις κάτι, εξήγησε γιατί.`;

  try {
    const response = await axios.post(
      ANTHROPIC_API,
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    return response.data.content[0].text;
  } catch (err) {
    console.error('[AI] Anthropic API error:', err.response?.data || err.message);
    return '❌ Δεν μπόρεσα να επεξεργαστώ την ερώτησή σου. Δοκίμασε ξανά σε λίγο.';
  }
}

module.exports = { askAI, addWeekToHistory, loadHistory };
