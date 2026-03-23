// ============================
// AUTH.JS - EcoCity
// ============================

document.addEventListener('DOMContentLoaded', function() {

    // ============================
    // LOGIN
    // ============================

    // Ελέγχουμε αν είμαστε στη σελίδα login
    var loginForm = document.querySelector('form');
    var isLoginPage = document.querySelector('h2') && 
                      document.querySelector('h2').textContent === 'Login';

    if (isLoginPage) {

        // 1. Εύρεση στοιχείων φόρμας login
        var inputs      = document.querySelectorAll('input');
        var emailInput    = inputs[0];   // πρώτο input = email
        var passwordInput = inputs[1];   // δεύτερο input = password
        var loginBtn      = document.querySelector('button');

        // 2. Όταν ο χρήστης πατήσει Σύνδεση
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Διαβάζουμε τις τιμές
            var email    = emailInput.value;
            var password = passwordInput.value;

            // Έλεγχος αν τα πεδία είναι κενά
            if (!email || !password) {
                alert('⚠️ Παρακαλώ συμπλήρωσε όλα τα πεδία!');
                return;
            }

            // Στέλνουμε τα δεδομένα στο PHP
            fetch('php/auth/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email:    email,
                    password: password
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    // Επιτυχής σύνδεση
                    alert('✅ Καλώς ήρθες ' + data.username + '!');
                    // Ανακατεύθυνση στην αρχική
                    window.location.href = 'index.html';
                } else {
                    // Αποτυχία σύνδεσης
                    alert('❌ ' + data.message);
                }
            })
            .catch(function(error) {
                console.error('❌ Σφάλμα σύνδεσης:', error);
                alert('❌ Σφάλμα σύνδεσης!');
            });
        });
    }

    // ============================
    // REGISTER
    // ============================

    // Ελέγχουμε αν είμαστε στη σελίδα register
    var isRegisterPage = document.querySelector('h2') && 
                         document.querySelector('h2').textContent === 'Register';

    if (isRegisterPage) {

        // 1. Εύρεση στοιχείων φόρμας register
        var inputs       = document.querySelectorAll('input');
        var usernameInput = inputs[0];   // πρώτο input = username
        var emailInput    = inputs[1];   // δεύτερο input = email
        var passwordInput = inputs[2];   // τρίτο input = password
        var municipalitySelect = document.querySelector('select');
        var registerBtn   = document.querySelector('button');

        // 2. Γεμίζουμε το select με τους δήμους
        var municipalities = [
            "Αθήνα", "Πειραιάς", "Αιγάλεω",
            "Νίκαια-Αγ. Ιωάννης Ρέντης", "Περιστέρι",
            "Χαλάνδρι", "Γλυφάδα", "Καλλιθέα",
            "Ηλιούπολη", "Μαρούσι", "Κηφισιά",
            "Παλαιό Φάληρο"
        ];

        municipalities.forEach(function(municipality) {
            var option = document.createElement('option');
            option.value = municipality;
            option.textContent = municipality;
            municipalitySelect.appendChild(option);
        });

        // 3. Όταν ο χρήστης πατήσει Εγγραφή
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Διαβάζουμε τις τιμές
            var username     = usernameInput.value;
            var email        = emailInput.value;
            var password     = passwordInput.value;
            var municipality = municipalitySelect.value;

            // Έλεγχος αν τα πεδία είναι κενά
            if (!username || !email || !password) {
                alert('⚠️ Παρακαλώ συμπλήρωσε όλα τα πεδία!');
                return;
            }

            // Έλεγχος αν έχει επιλεγεί δήμος
            if (municipality === 'Επιλογή Δήμου') {
                alert('⚠️ Παρακαλώ επίλεξε δήμο!');
                return;
            }

            // Στέλνουμε τα δεδομένα στο PHP
            fetch('php/auth/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username:     username,
                    email:        email,
                    password:     password,
                    municipality: municipality
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    // Επιτυχής εγγραφή
                    alert('✅ Η εγγραφή ολοκληρώθηκε!');
                    // Ανακατεύθυνση στο login
                    window.location.href = 'login.html';
                } else {
                    // Αποτυχία εγγραφής
                    alert('❌ ' + data.message);
                }
            })
            .catch(function(error) {
                console.error('❌ Σφάλμα εγγραφής:', error);
                alert('❌ Σφάλμα εγγραφής!');
            });
        });
    }

});