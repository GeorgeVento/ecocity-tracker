// ============================
// VALIDATION.JS - EcoCity
// ============================

// 1. Συνάρτηση ελέγχου email
function isValidEmail(email) {
    return email.includes('@') && email.includes('.');
}

// 2. Συνάρτηση ελέγχου password
function isValidPassword(password) {
    return password.length >= 6;
}

// 3. Συνάρτηση εμφάνισης λάθους
function showError(input, message) {
    // Αφαιρούμε παλιό λάθος αν υπάρχει
    removeError(input);

    // Προσθέτουμε κόκκινο περίγραμμα
    input.style.border = '2px solid red';

    // Δημιουργούμε μήνυμα λάθους
    var error = document.createElement('small');
    error.textContent = message;
    error.style.color = 'red';
    error.className = 'error-message';

    // Το βάζουμε κάτω από το input
    input.parentNode.appendChild(error);
}

// 4. Συνάρτηση αφαίρεσης λάθους
function removeError(input) {
    input.style.border = '';
    var error = input.parentNode.querySelector('.error-message');
    if (error) error.remove();
}

// 5. Συνάρτηση εμφάνισης επιτυχίας
function showSuccess(input) {
    removeError(input);
    input.style.border = '2px solid green';
}

// ============================
// VALIDATION LOGIN
// ============================
function validateLogin() {
    var inputs    = document.querySelectorAll('input');
    var email     = inputs[0];
    var password  = inputs[1];
    var isValid   = true;

    // Έλεγχος email
    if (!email.value) {
        showError(email, '⚠️ Το email είναι υποχρεωτικό!');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, '⚠️ Μη έγκυρο email!');
        isValid = false;
    } else {
        showSuccess(email);
    }

    // Έλεγχος password
    if (!password.value) {
        showError(password, '⚠️ Το password είναι υποχρεωτικό!');
        isValid = false;
    } else if (!isValidPassword(password.value)) {
        showError(password, '⚠️ Το password πρέπει να έχει τουλάχιστον 6 χαρακτήρες!');
        isValid = false;
    } else {
        showSuccess(password);
    }

    return isValid;
}

// ============================
// VALIDATION REGISTER
// ============================
function validateRegister() {
    var inputs    = document.querySelectorAll('input');
    var username  = inputs[0];
    var email     = inputs[1];
    var password  = inputs[2];
    var municipality = document.querySelector('select');
    var isValid   = true;

    // Έλεγχος username
    if (!username.value) {
        showError(username, '⚠️ Το username είναι υποχρεωτικό!');
        isValid = false;
    } else {
        showSuccess(username);
    }

    // Έλεγχος email
    if (!email.value) {
        showError(email, '⚠️ Το email είναι υποχρεωτικό!');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, '⚠️ Μη έγκυρο email!');
        isValid = false;
    } else {
        showSuccess(email);
    }

    // Έλεγχος password
    if (!password.value) {
        showError(password, '⚠️ Το password είναι υποχρεωτικό!');
        isValid = false;
    } else if (!isValidPassword(password.value)) {
        showError(password, '⚠️ Το password πρέπει να έχει τουλάχιστον 6 χαρακτήρες!');
        isValid = false;
    } else {
        showSuccess(password);
    }

    // Έλεγχος δήμου
    if (municipality.value === 'Επιλογή Δήμου') {
        alert('⚠️ Παρακαλώ επίλεξε δήμο!');
        isValid = false;
    }

    return isValid;
}

// ============================
// VALIDATION REPORT
// ============================
function validateReport() {
    var selects     = document.querySelectorAll('select');
    var category    = selects[0];
    var severity    = selects[1];
    var description = document.querySelector('textarea');
    var isValid     = true;

    // Έλεγχος κατηγορίας
    if (category.value === 'Κατηγορία') {
        alert('⚠️ Παρακαλώ επίλεξε κατηγορία!');
        isValid = false;
    }

    // Έλεγχος σοβαρότητας
    if (severity.value === 'Σοβαρότητα') {
        alert('⚠️ Παρακαλώ επίλεξε σοβαρότητα!');
        isValid = false;
    }

    // Έλεγχος περιγραφής
    if (!description.value) {
        showError(description, '⚠️ Η περιγραφή είναι υποχρεωτική!');
        isValid = false;
    } else {
        showSuccess(description);
    }

    return isValid;
}

// ============================
// ΕΚΚΙΝΗΣΗ - ποια σελίδα είμαστε
// ============================
document.addEventListener('DOMContentLoaded', function() {

    var h2 = document.querySelector('h2');
    if (!h2) return;

    var page = h2.textContent;
    var btn  = document.querySelector('button');

    // Login σελίδα
    if (page === 'Login') {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateLogin()) {
                // Αν όλα είναι σωστά συνεχίζει το auth.js
                console.log('✅ Login validation passed!');
            }
        });
    }

    // Register σελίδα
    if (page === 'Register') {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateRegister()) {
                console.log('✅ Register validation passed!');
            }
        });
    }

    // Report σελίδα
    if (page === 'Νέα Αναφορά') {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateReport()) {
                console.log('✅ Report validation passed!');
            }
        });
    }

});