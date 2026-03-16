# 🌿 EcoCity Tracker

<div align="center">

**Κοινοτική Εφαρμογή Καταγραφής Περιβαλλοντικών Προβλημάτων**

Διαθεματική Εργασία ΣΑΕΚ ΑΙΓΑΛΕΩ · 4ο Εξάμηνο · 2025-2026

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PHP](https://img.shields.io/badge/PHP-8.0-777BB4?style=flat&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)](https://git-scm.com)

</div>

---

## 📋 Περίληψη

Το **EcoCity Tracker** είναι full-stack web εφαρμογή που επιτρέπει στους πολίτες να καταγράφουν περιβαλλοντικά προβλήματα της πόλης τους — σκουπίδια, ηχορύπανση, ποιότητα αέρα, περιβαλλοντική μόλυνση. Τα δεδομένα αποθηκεύονται σε βάση δεδομένων MySQL και εμφανίζονται ανά **Δήμο της Αττικής** με αναλυτικά στατιστικά.

Κάθε δήμος έχει ξεχωριστό **Admin Panel** όπου ο διαχειριστής:
- βλέπει τους χρήστες και τις αναφορές **μόνο του δήμου του**
- αλλάζει το status αναφορών (`pending` → `reviewed` → `resolved`)
- κάνει **export σε Excel** τα δεδομένα του δήμου του

**Περίοδος ανάπτυξης:** 16 Μαρτίου – 22 Απριλίου 2026 · ~30 λεπτά/μέρα

---

## 👥 Ομάδα

| Μέλος | Τομέας | Ποσοστό |
|-------|--------|---------|
| 🟢 **Γιώργος-Λεωνίδας Βεντουράτος** | DB Design · HTML αρχεία · CSS Styling · Security Review · Docs | ~40% |
| 🔵 **Δήμος Χριστοδούλου** | PHP Auth & API · Export Excel · Security · Cross-browser testing | ~30% |
| 🟣 **Γιώργος Παπαδάκης** | JavaScript AJAX · stats.js · admin.js · Validation · Testing | ~30% |

📧 g.l.ventouratos@gmail.com · 🏫 ΣΑΕΚ ΑΙΓΑΛΕΩ · 📅 Παράδοση: 22 Απριλίου 2026

---

## 🛠️ Τεχνολογίες

| Layer | Τεχνολογία | Χρήση |
|-------|------------|-------|
| 🖥️ Frontend | HTML5, CSS3, JavaScript ES6+ | UI, forms, DOM manipulation, AJAX |
| ⚙️ Backend | PHP 8 + PDO | API endpoints, sessions, export |
| 🗄️ Database | MySQL 8 | 4 πίνακες, JOINs, GROUP BY |
| 🔧 Local Server | MAMP | Apache + MySQL + PHP τοπικά |
| 📝 Editor | VS Code | PHP Intelephense, Live Server, GitLens |
| 🔀 Version Control | Git + GitHub | Commits, backup, portfolio |

---

## 📁 Δομή Φακέλων

```
ecocity/
├── index.html              ← Αρχική σελίδα (επιλογή δήμου)
├── register.html           ← Εγγραφή χρήστη
├── login.html              ← Σύνδεση χρήστη
├── report.html             ← Φόρμα υποβολής αναφοράς
├── stats.html              ← Στατιστικά ανά δήμο (HTML table)
├── admin-login.html        ← Σύνδεση admin δήμου
├── admin.html              ← Admin panel (χρήστες + αναφορές + export)
├── css/
│   └── style.css           ← Όλα τα styles + responsive
├── js/
│   ├── auth.js             ← Login / Register AJAX
│   ├── validation.js       ← Client-side form validation
│   ├── report.js           ← Submit αναφοράς
│   ├── stats.js            ← Στατιστικά ανά δήμο
│   └── admin.js            ← Admin panel logic + export Excel
├── php/
│   ├── db_connect.php      ← PDO σύνδεση MySQL
│   ├── auth/
│   │   ├── register.php    ← Εγγραφή (password_hash)
│   │   ├── login.php       ← Σύνδεση (sessions + role check)
│   │   ├── logout.php      ← Αποσύνδεση (session_destroy)
│   │   └── session_check.php ← Επιστρέφει current user info
│   ├── api/
│   │   ├── get_reports.php ← Αναφορές φιλτραρισμένες ανά δήμο
│   │   ├── add_report.php  ← Υποβολή νέας αναφοράς
│   │   ├── get_stats.php   ← Στατιστικά GROUP BY municipality+category
│   │   └── export_excel.php ← Export CSV/Excel με UTF-8 BOM
│   └── admin/
│       ├── update_report.php ← Αλλαγή status (admin only)
│       └── delete_report.php ← Διαγραφή (admin only)
├── schema.sql              ← CREATE TABLE scripts
├── seed_data.sql           ← Δοκιμαστικά δεδομένα (10 δήμοι Αττικής)
├── .gitignore
└── README.md
```

---

## 🚀 Εγκατάσταση & Εκτέλεση

### Προαπαιτούμενα

- [MAMP](https://mamp.info) (ή XAMPP)
- [VS Code](https://code.visualstudio.com)
- [Git](https://git-scm.com)

### Βήματα

```bash
# 1. Clone του repository
git clone https://github.com/YOUR_USERNAME/ecocity-tracker.git
cd ecocity-tracker

# 2. Αντιγραφή στο MAMP htdocs
cp -r . /Applications/MAMP/htdocs/ecocity

# 3. Άνοιγμα MAMP → Start Servers

# 4. Δημιουργία βάσης δεδομένων
#    → http://localhost:8888/phpMyAdmin
#    → New → ecocity_db → Collation: utf8mb4_unicode_ci → Create

# 5. Εκτέλεση SQL
#    → ecocity_db → SQL tab
#    → Εκτέλεση schema.sql
#    → Εκτέλεση seed_data.sql

# 6. Άνοιγμα εφαρμογής
open http://localhost:8888/ecocity
```

### Δοκιμαστικοί Λογαριασμοί

| Username | Email | Password | Role | Δήμος |
|----------|-------|----------|------|-------|
| `admin_aigaleo` | admin@aigaleo.gr | βλ. seed_data.sql | admin | Αιγάλεω |
| `admin_athens` | admin@athens.gr | βλ. seed_data.sql | admin | Αθήνα |
| `george` | george@test.com | βλ. seed_data.sql | user | — |

---

## 🗄️ Σχήμα Βάσης Δεδομένων

```
municipalities          users                    categories
──────────────          ─────────────────        ──────────
id (PK)                 id (PK)                  id (PK)
name                    username (UNIQUE)         name
region                  email (UNIQUE)            color
                        password_hash
                        role (user/admin)
                        municipality_id (FK)
                        created_at

reports
──────────────────────────────────
id (PK)
user_id         (FK → users)
municipality_id (FK → municipalities)
category_id     (FK → categories)
severity        (1–5)
description     (TEXT)
status          (pending / reviewed / resolved)
created_at      (TIMESTAMP)
```

---

## ✅ Λειτουργικές Απαιτήσεις

| # | Λειτουργία | Αρχεία | Υπεύθυνος | Κατάσταση |
|---|-----------|--------|-----------|-----------|
| F1 | HTML δομή 6 σελίδων + CSS | `*.html`, `style.css` | Βεντουράτος | ☐ |
| F2 | Βάση δεδομένων 4 πίνακες | `schema.sql`, `seed_data.sql` | Βεντουράτος | ☐ |
| F3 | Security: SQL injection + XSS | Όλα τα PHP | Βεντουράτος | ☐ |
| F4 | Responsive mobile design | `style.css` media queries | Βεντουράτος | ☐ |
| F5 | Εγγραφή χρήστη (με επιλογή δήμου) | `register.php` | Χριστοδούλου | ☐ |
| F6 | Σύνδεση & αποσύνδεση (session) | `login.php`, `logout.php` | Χριστοδούλου | ☐ |
| F7 | Υποβολή αναφοράς | `add_report.php`, `report.js` | Χριστοδούλου | ☐ |
| F8 | Export αναφορών σε Excel | `export_excel.php` | Χριστοδούλου | ☐ |
| F9 | AJAX login / register | `auth.js` | Παπαδάκης | ☐ |
| F10 | Στατιστικά ανά δήμο (HTML table) | `stats.js`, `get_stats.php` | Παπαδάκης | ☐ |
| F11 | Admin panel: χρήστες + αναφορές | `admin.js`, `get_reports.php` | Παπαδάκης | ☐ |
| F12 | Admin αλλάζει status αναφορών | `update_report.php`, `admin.js` | Παπαδάκης | ☐ |

---

## 📅 Καθημερινό Progress Log

| # | Ημερομηνία | Φάση | Στόχος Ημέρας | Εργασία που έκανα | Τεχνολογία | Git Commit Message | ✅ | Παρατηρήσεις |
|---|-----------|------|--------------|------------------|-----------|-------------------|---|--------------|
| 1 | 16/03/2026 | 1 – Σχεδιασμός | MAMP + δομή φακέλων | | HTML, MAMP | `Day 1: MAMP setup, project folder structure created` | ☐ | |
| 2 | 17/03/2026 | 1 – Σχεδιασμός | VS Code + README + ER Diagram | | VS Code, Markdown | `Day 2: VS Code setup, README.md, database_design.md` | ☐ | |
| 3 | 18/03/2026 | 2 – Database | MySQL: municipalities + categories | | MySQL | `Day 3: schema.sql - municipalities, categories tables` | ☐ | |
| 4 | 19/03/2026 | 2 – Database | MySQL: users + reports + seed data | | MySQL | `Day 4: schema.sql complete - all tables with FK, seed_data.sql` | ☐ | |
| 5 | 20/03/2026 | 2 – Database | db_connect.php (PDO) | | PHP, PDO | `Day 5: php/db_connect.php - PDO connection` | ☐ | |
| 6 | 23/03/2026 | 3 – PHP Backend | register.php + login.php | | PHP, Sessions | `Day 6: php/auth/register.php + login.php` | ☐ | |
| 7 | 24/03/2026 | 3 – PHP Backend | logout.php + session_check.php | | PHP | `Day 7: logout.php, session_check.php` | ☐ | |
| 8 | 25/03/2026 | 3 – PHP Backend | get_reports.php + add_report.php | | PHP, PDO | `Day 8: get_reports.php + add_report.php API endpoints` | ☐ | |
| 9 | 26/03/2026 | 3 – PHP Backend | get_stats.php (ανά δήμο) | | PHP, SQL | `Day 9: get_stats.php with municipality + category GROUP BY` | ☐ | |
| 10 | 27/03/2026 | 3 – PHP Backend | update/delete_report.php + export_excel.php | | PHP | `Day 10: admin CRUD endpoints + export_excel.php` | ☐ | |
| 11 | 30/03/2026 | 4 – Frontend | index.html + register.html + login.html | | HTML5 | `Day 11: index, register, login HTML pages` | ☐ | |
| 12 | 31/03/2026 | 4 – Frontend | report.html + stats.html | | HTML5 | `Day 12: report.html + stats.html` | ☐ | |
| 13 | 01/04/2026 | 4 – Frontend | admin-login.html + admin.html | | HTML5 | `Day 13: admin-login.html + admin.html` | ☐ | |
| 14 | 02/04/2026 | 4 – Frontend | style.css: base + navbar + forms + cards | | CSS3, Flexbox | `Day 14: style.css base styles, navbar, forms, cards` | ☐ | |
| 15 | 03/04/2026 | 4 – Frontend | style.css: stats + admin + responsive | | CSS3, Grid | `Day 15: style.css stats table, admin badges, media queries` | ☐ | |
| 16 | 06/04/2026 | 5 – JavaScript | js/auth.js (AJAX login/register) | | JS, fetch() | `Day 16: js/auth.js AJAX login and register` | ☐ | |
| 17 | 07/04/2026 | 5 – JavaScript | js/validation.js + js/report.js | | JS | `Day 17: js/validation.js + js/report.js AJAX submit` | ☐ | |
| 18 | 08/04/2026 | 5 – JavaScript | js/stats.js (στατιστικά ανά δήμο) | | JS | `Day 18: js/stats.js fetch + renderStatsTable()` | ☐ | |
| 19 | 09/04/2026 | 5 – JavaScript | js/admin.js (panel + export trigger) | | JS | `Day 19: js/admin.js full admin panel + export Excel` | ☐ | |
| 20 | 10/04/2026 | 6 – Security | Security review + htmlspecialchars | | PHP | `Day 20: security review all PHP files` | ☐ | |
| 21 | 13/04/2026 | 7 – Testing | End-to-end testing + bug fixes | | All | `Day 21: end-to-end test checklist + bug fixes` | ☐ | |
| 22 | 14/04/2026 | 7 – Testing | Cross-browser + mobile testing | | All | `Day 22: cross-browser + mobile testing, testing_log.md` | ☐ | |
| 23 | 15/04/2026 | 8 – Παράδοση | Code cleanup + README screenshots + git tag | | Git | `v1.0 Final release - EcoCity Tracker complete! 🎉` | ☐ | |

---

## 🗓️ Επιπλέον Ημέρες (Buffer / Catch-up)

> Αυτές οι μέρες είναι για να φτάσουμε ό,τι έμεινε πίσω ή για επιπλέον βελτιώσεις.

| Ημερομηνία | Εργασία | Git Commit Message | Παρατηρήσεις |
|-----------|---------|-------------------|--------------|
| 16/04/2026 | | | |
| 17/04/2026 | | | |
| 20/04/2026 | | | |
| 21/04/2026 | | | |
| 22/04/2026 | | | |

---

## 🔒 Ασφάλεια

| Απειλή | Ρίσκο | Προστασία | Υλοποίηση |
|--------|-------|-----------|-----------|
| SQL Injection | 🔴 Υψηλό | Prepared Statements | `PDO::prepare()` + `execute()` |
| XSS | 🔴 Υψηλό | Output escaping | `htmlspecialchars()` σε κάθε output |
| Weak passwords | 🟡 Μέτριο | Bcrypt hashing | `password_hash()` / `password_verify()` |
| Unauthorized access | 🔴 Υψηλό | Session check + role check | `session_start()` + `role === 'admin'` |
| Cross-municipality access | 🔴 Υψηλό | Municipality ID isolation | `WHERE municipality_id = $_SESSION[user][municipality_id]` |

---

## 🌐 Διαθεματική Σύνδεση

| Μάθημα | Σύνδεση με το Project |
|--------|-----------------------|
| 💻 Πληροφορική | Full-stack ανάπτυξη, client-server αρχιτεκτονική, ασφάλεια |
| 🌱 Βιολογία/Περιβάλλον | Κατηγορίες ρύπανσης, επιπτώσεις στην υγεία, severity scale |
| 🗺️ Γεωγραφία | Δήμοι Αττικής, χωρική οργάνωση δεδομένων ανά περιοχή |
| 📊 Μαθηματικά | Στατιστική, SQL COUNT/GROUP BY, ανάλυση τάσεων |
| 🏛️ Κοινωνική Αγωγή | Civic tech, ενεργός πολίτης, τοπική αυτοδιοίκηση |
| ✏️ Γλώσσα | Τεχνική συγγραφή, τεκμηρίωση, README |

---

## 🏙️ Δήμοι Αττικής — Αρχική Φάση

| | | |
|---|---|---|
| Αθήνα | Πειραιάς | Αιγάλεω |
| Νίκαια-Αγ. Ιωάννης Ρέντης | Περιστέρι | Χαλάνδρι |
| Γλυφάδα | Καλλιθέα | Ηλιούπολη |
| Μαρούσι | Κηφισιά | Παλαιό Φάληρο |

> Στο μέλλον μπορεί να επεκταθεί σε ολόκληρη την Ελλάδα.

---

## 🔮 Μελλοντικές Βελτιώσεις

1. **Leaflet.js** – Προσθήκη διαδραστικού χάρτη με markers ανά δήμο και κατηγορία
2. **Chart.js** – Bar/Doughnut charts για στατιστικά αντί HTML tables
3. **PWA** – Μετατροπή σε εγκαταστάσιμο app (manifest.json + service worker)
4. **React.js** – Αναβάθμιση σε component-based frontend αρχιτεκτονική
5. **Push Notifications** – Ειδοποιήσεις σε admin για νέες αναφορές
6. **Upload Φωτογραφίας** – Επισύναψη εικόνας σε κάθε αναφορά

---

## 📚 Πηγές

**Επίσημη Τεκμηρίωση**
- [MDN Web Docs](https://developer.mozilla.org) – HTML, CSS, JavaScript
- [PHP Manual](https://php.net/manual/el) – PHP 8
- [MySQL Docs](https://dev.mysql.com/doc) – MySQL 8
- [Git Docs](https://git-scm.com/docs) – Version control

**Εργαλεία**
- [MAMP](https://mamp.info) · [VS Code](https://code.visualstudio.com) · [TablePlus](https://tableplus.com) · [GitHub](https://github.com) · [Figma](https://figma.com)

---

<div align="center">

**EcoCity Tracker** &nbsp;·&nbsp; © George-Leonidas Ventouratos

*Διαθεματική Εργασία ΣΑΕΚ ΑΙΓΑΛΕΩ · 4ο Εξάμηνο Έτους 2025-2026*

</div>
