# 🌿 EcoCity Tracker

> **Κοινοτική Εφαρμογή Περιβαλλοντικής Παρακολούθησης Πόλης**  
> Διαθεματική Εργασία ΣΑΕΚ ΑΙΓΑΛΕΩ · 4ο Εξάμηνο Έτους 2026

---

## 👥 Ομάδα

| Μέλος | Τομέας Ευθύνης | Ποσοστό |
|-------|---------------|---------|
| **🟢 Γιώργος-Λεωνίδας Βεντουράτος** · g.l.ventouratos@gmail.com | DB Design & Schema · Όλα τα HTML αρχεία · API Design · Security Review · README | ~40% |
| **🔵 Δήμος Χριστοδούλου** | PHP Auth & API Endpoints · CSS Styling · File Upload · Responsive Design · Export CSV | ~30% |
| **🟣 Γιώργος Παπαδάκης** | JavaScript AJAX · Leaflet.js χάρτης · Chart.js γραφήματα · Admin JS · Testing | ~30% |

---

## 📋 Περίληψη

Το **EcoCity Tracker** είναι full-stack web εφαρμογή που επιτρέπει στους πολίτες να καταγράφουν περιβαλλοντικά προβλήματα της πόλης τους (σκουπίδια, ηχορύπανση, ποιότητα αέρα, κ.ά.). Τα δεδομένα αποθηκεύονται σε βάση δεδομένων MySQL και παρουσιάζονται σε πραγματικό χρόνο σε διαδραστικό χάρτη (Leaflet.js) και γραφήματα στατιστικών (Chart.js).

**Περίοδος ανάπτυξης:** 11 Μαρτίου – 19 Απριλίου 2026

---

## 🛠️ Τεχνολογίες

| Layer | Τεχνολογία | Χρήση |
|-------|------------|-------|
| 🖥️ Frontend | HTML5, CSS3, JavaScript ES6+ | UI, forms, DOM manipulation |
| 🗺️ Χάρτης | Leaflet.js + OpenStreetMap | Διαδραστικός χάρτης με markers |
| 📊 Γραφήματα | Chart.js | Bar, Line, Doughnut charts |
| ⚙️ Backend | PHP 8 + PDO | API endpoints, sessions, file upload |
| 🗄️ Database | MySQL 8 | Αποθήκευση δεδομένων |
| 🔧 Local Server | MAMP | Τοπικό περιβάλλον ανάπτυξης |
| 📝 Editor | VS Code | Συγγραφή κώδικα |
| 🔀 Version Control | Git + GitHub | Ιστορικό, backup, portfolio |

---

## 📁 Δομή Φακέλων

```
ecocity/
├── index.html            ← Αρχική σελίδα
├── register.html         ← Εγγραφή χρήστη
├── login.html            ← Σύνδεση
├── report.html           ← Φόρμα αναφοράς
├── dashboard.html        ← Στατιστικά & γραφήματα
├── admin.html            ← Admin panel
├── map.html              ← Χάρτης αναφορών
├── css/
│   └── style.css         ← Όλα τα styles + responsive
├── js/
│   ├── auth.js           ← Login / Register AJAX
│   ├── validation.js     ← Client-side form validation
│   ├── map.js            ← Leaflet.js χάρτης & markers
│   ├── report.js         ← Submit αναφοράς (FormData)
│   ├── charts.js         ← Chart.js γραφήματα
│   └── admin.js          ← Admin panel logic
├── php/
│   ├── db_connect.php    ← PDO σύνδεση MySQL
│   ├── auth/             ← register, login, logout, session_check
│   ├── api/              ← get_reports, add_report, get_stats, export_csv
│   └── admin/            ← update_report, delete_report
├── uploads/              ← Φωτογραφίες χρηστών (gitignored)
├── schema.sql            ← CREATE TABLE scripts
├── seed_data.sql         ← Δοκιμαστικά δεδομένα
├── .gitignore
└── README.md
```

---

## 🚀 Εγκατάσταση & Εκτέλεση

### Προαπαιτούμενα
- [MAMP](https://mamp.info) (ή XAMPP/Laragon)
- [VS Code](https://code.visualstudio.com)
- [Git](https://git-scm.com)

### Βήματα

```bash
# 1. Clone του repository
git clone https://github.com/georgevento/ecocity-tracker.git

# 2. Αντιγραφή στο MAMP htdocs
cp -r ecocity-tracker /Applications/MAMP/htdocs/ecocity

# 3. Άνοιγμα MAMP → Start Servers

# 4. phpMyAdmin → http://localhost:8888/phpMyAdmin
#    New → ecocity_db → Collation: utf8mb4_unicode_ci → Create

# 5. Εκτέλεση SQL:
#    ecocity_db → SQL tab → import schema.sql → import seed_data.sql

# 6. Άνοιγμα εφαρμογής:
#    http://localhost:8888/ecocity
```

### Δοκιμαστικοί Λογαριασμοί
| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@test.com | (βλ. seed_data.sql) | admin |
| george | george@test.com | (βλ. seed_data.sql) | user |

---

## 🗄️ Σχήμα Βάσης Δεδομένων

```
users              categories         reports
─────────          ──────────         ──────────────────────
id (PK)            id (PK)            id (PK)
username           name               user_id     (FK→users)
email              color              category_id (FK→categories)
password_hash      icon               severity (1-5)
role (user/admin)                     latitude / longitude
created_at                            description
                                      photo_path
                                      status (pending/reviewed/resolved)
                                      created_at
```

---

## 🔒 Ασφάλεια

| Απειλή | Προστασία | Υλοποίηση |
|--------|-----------|-----------|
| SQL Injection | Prepared Statements | `PDO::prepare()` + `execute()` |
| XSS | Output escaping | `htmlspecialchars()` σε όλα τα outputs |
| Weak passwords | Bcrypt hashing | `password_hash()` / `password_verify()` |
| Unauthorized access | Session check | `session_start()` + role verification |
| File upload abuse | Type & size validation | MIME check + 5MB limit |

---

## ✅ Λειτουργικές Απαιτήσεις

| # | Λειτουργία | Αρχεία | Υπεύθυνος | Κατάσταση |
|---|-----------|--------|-----------|-----------|
| F1 | HTML δομή 7 σελίδων | *.html | Βεντουράτος | ☐ |
| F2 | DB Design & Schema SQL | schema.sql | Βεντουράτος | ☐ |
| F3 | API Design & queries | api_design.md | Βεντουράτος | ☐ |
| F4 | Security review (XSS, SQLi) | Όλα τα PHP | Βεντουράτος | ☐ |
| F5 | Εγγραφή χρήστη | register.php | Χριστοδούλου | ☐ |
| F6 | Σύνδεση & session | login.php | Χριστοδούλου | ☐ |
| F7 | Υποβολή αναφοράς + upload | add_report.php | Χριστοδούλου | ☐ |
| F8 | Responsive mobile design | style.css | Χριστοδούλου | ☐ |
| F9 | Export CSV | export_csv.php | Χριστοδούλου | ☐ |
| F10 | Χάρτης με markers & φίλτρα | map.js, Leaflet.js | Παπαδάκης | ☐ |
| F11 | AJAX login/register | auth.js | Παπαδάκης | ☐ |
| F12 | Dashboard γραφήματα & KPI | charts.js, Chart.js | Παπαδάκης | ☐ |
| F13 | Admin panel | admin.js | Παπαδάκης | ☐ |

> Αλλάξτε τα `☐` σε `✅` όταν ολοκληρωθεί κάθε λειτουργία.

---

## 🌐 Διαθεματική Σύνδεση

| Μάθημα | Σύνδεση με το Project |
|--------|-----------------------|
| 💻 Πληροφορική | Full-stack ανάπτυξη, client-server αρχιτεκτονική, ασφάλεια |
| 🌱 Βιολογία/Περιβάλλον | Κατηγορίες ρύπανσης, επιπτώσεις στην υγεία |
| 🗺️ Γεωγραφία | GPS συντεταγμένες, χαρτογράφηση, χωρική ανάλυση |
| 📊 Μαθηματικά | Στατιστική, γραφήματα, ανάλυση τάσεων, SQL GROUP BY |
| 🏛️ Κοινωνική Αγωγή | Civic tech, ενεργός πολίτης, τοπική αυτοδιοίκηση |
| ✏️ Γλώσσα | Τεχνική συγγραφή, τεκμηρίωση, παρουσίαση αποτελεσμάτων |

---

## 📅 Εβδομαδιαίο Πρόγραμμα & Progress Log

> ❗ **Git rule:** Κάθε εβδομάδα πρέπει να υπάρχουν commits από ΚΑΘΕνα μέλος.  
> Κάθε μέλος κάνει τα tasks του σε **οποιαδήποτε μέρα** μέσα στην εβδομάδα.

```bash
# Git workflow — τρέχει πριν κλείσεις τον υπολογιστή:
cd /Applications/MAMP/htdocs/ecocity
git status
git add .
git commit -m "..."
git push
```

---

### 📅 Εβδομάδα 1 — Σχεδιασμός & Εγκατάσταση (11–16 Μαρτίου 2026)

| Μέλος | Tasks εβδομάδας | Κατάσταση |
|-------|----------------|-----------|
| 🟢 Βεντουράτος | MAMP setup · VS Code + extensions · Figma wireframes · database_design.md · README.md skeleton | ☐ |
| 🔵 Χριστοδούλου | phpMyAdmin εξοικείωση · δημιουργία ecocity_db · μελέτη PHP/PDO · db_connect.php skeleton | ☐ |
| 🟣 Παπαδάκης | git init · GitHub remote · .gitignore · μελέτη JS ES6+ · fetch() δοκιμές σε test file | ☐ |

**Commit message εβδομάδας:**
```
Week 1: MAMP setup, db_connect skeleton, git init, wireframes
```

---

### 📅 Εβδομάδα 2 — Βάση Δεδομένων & HTML Structure (17–23 Μαρτίου 2026)

| Μέλος | Tasks εβδομάδας | Κατάσταση |
|-------|----------------|-----------|
| 🟢 Βεντουράτος | MySQL tables (categories + users + reports) · seed_data.sql · api_design.md · queries.sql | ☐ |
| 🔵 Χριστοδούλου | db_connect.php ολοκλήρωση PDO · register.php · login.php · logout.php · session_check.php | ☐ |
| 🟣 Παπαδάκης | 7 HTML αρχεία · validation.js skeleton · auth.js skeleton | ☐ |

**Commit message εβδομάδας:**
```
Week 2: MySQL schema complete, PHP auth endpoints, 7 HTML pages
```

---

### 📅 Εβδομάδα 3 — PHP APIs & JavaScript (24–30 Μαρτίου 2026)

| Μέλος | Tasks εβδομάδας | Κατάσταση |
|-------|----------------|-----------|
| 🟢 Βεντουράτος | css/style.css (CSS Variables, Flexbox navbar, Grid cards, form styles) · HTML review · security check | ☐ |
| 🔵 Χριστοδούλου | get_reports.php · add_report.php (file upload) · get_stats.php · update/delete_report.php · export_csv.php | ☐ |
| 🟣 Παπαδάκης | validation.js · auth.js (AJAX) · map.js (Leaflet markers) · report.js (FormData) · charts.js (bar + doughnut) | ☐ |

**Commit message εβδομάδας:**
```
Week 3: CSS complete, PHP APIs done, JS map+charts+AJAX working
```

---

### 📅 Εβδομάδα 4 — Dashboard, Admin & Security (31 Μαρτίου – 6 Απριλίου 2026)

| Μέλος | Tasks εβδομάδας | Κατάσταση |
|-------|----------------|-----------|
| 🟢 Βεντουράτος | Responsive CSS (media queries) · mobile navbar · HTML accessibility · security review ΟΛΩΝ PHP | ☐ |
| 🔵 Χριστοδούλου | CSS dashboard + admin badges · cross-browser testing (Chrome/Safari/Firefox) · testing_log.md | ☐ |
| 🟣 Παπαδάκης | charts.js line chart · admin.js (table + updateStatus + delete) · map φίλτρα · mobile testing | ☐ |

**Commit message εβδομάδας:**
```
Week 4: responsive CSS, admin panel, security review, cross-browser fixes
```

---

### 📅 Εβδομάδα 5 — Final Polish (7–13 Απριλίου 2026)

| Μέλος | Tasks εβδομάδας | Κατάσταση |
|-------|----------------|-----------|
| 🟢 Βεντουράτος | README.md τελικό + screenshots · progress log · τελικός HTML check | ☐ |
| 🔵 Χριστοδούλου | PHPDoc comments · PHP cleanup · Postman full test | ☐ |
| 🟣 Παπαδάκης | αφαίρεση console.log() · JS comments · end-to-end testing checklist · testing_log.md | ☐ |

**Commit message εβδομάδας:**
```
Week 5: README final, PHP comments, JS cleanup, full testing
```

---

### 🎉 Παράδοση — Κυριακή 19 Απριλίου 2026

| Μέλος | Τελικές Εργασίες | ✓ |
|-------|-----------------|---|
| 🟢 Βεντουράτος | Τελικός HTML check · README screenshots τελικά | ☐ |
| 🔵 Χριστοδούλου | Full PHP test με Postman (όλα τα endpoints) | ☐ |
| 🟣 Παπαδάκης | End-to-end: Register → Login → Report → Map → Dashboard → Admin → Export | ☐ |

```bash
git add .
git commit -m "v1.0 Final release - EcoCity Tracker complete! 🎉"
git tag v1.0
git push && git push --tags
```

**Final Checklist:**
- [ ] Register → Login → Logout
- [ ] Υποβολή αναφοράς + φωτογραφία
- [ ] Χάρτης εμφανίζει markers + φίλτρα
- [ ] Dashboard εμφανίζει γραφήματα
- [ ] Admin αλλάζει status αναφορών
- [ ] Export CSV λειτουργεί
- [ ] Mobile responsive
- [ ] SQL injection + XSS protected

---

## 🔮 Μελλοντικές Βελτιώσεις

1. **PWA** – Μετατροπή σε εγκαταστάσιμο app (manifest.json + service worker)
2. **React.js** – Αναβάθμιση σε component-based frontend αρχιτεκτονική
3. **React Native** – Native iOS & Android app με τα ίδια PHP API endpoints
4. **Push Notifications** – Ειδοποιήσεις για νέες αναφορές κοντά στον χρήστη
5. **Machine Learning** – Αυτόματη κατηγοριοποίηση αναφορών από κείμενο
6. **OpenWeather API** – Real-time δεδομένα ποιότητας αέρα

---

## 📚 Πηγές

**Επίσημη Τεκμηρίωση**
- [MDN Web Docs](https://developer.mozilla.org) – HTML, CSS, JavaScript
- [PHP Manual](https://php.net/manual/el) – PHP 8
- [MySQL Docs](https://dev.mysql.com/doc) – MySQL 8
- [Leaflet.js](https://leafletjs.com/reference) – Διαδραστικοί χάρτες
- [Chart.js](https://chartjs.org/docs) – Γραφήματα
- [Git Docs](https://git-scm.com/docs) – Version control

**Εργαλεία**
- [MAMP](https://mamp.info) · [VS Code](https://code.visualstudio.com) · [TablePlus](https://tableplus.com) · [GitHub](https://github.com) · [Figma](https://figma.com) · [Postman](https://postman.com)

---

<div align="center">

**EcoCity Tracker** · © Γιώργος-Λεωνίδας Βεντουράτος, Δήμος Χριστοδούλου, Γιώργος Παπαδάκης

*Διαθεματική Εργασία ΣΑΕΚ ΑΙΓΑΛΕΩ · 4ο Εξάμηνο Έτους 2026*

</div>
