
// STATS.JS - EcoCity

// Περιμένουμε να φορτώσει η σελίδα
document.addEventListener('DOMContentLoaded', function() {

    // 1. Εύρεση στοιχείων HTML
    var select = document.querySelector('select');
    var tbody  = document.querySelector('tbody');

    // 2. Φόρτωση δήμων στο select από PHP
    fetch('php/api/get_stats.php')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Παίρνουμε μοναδικούς δήμους
            var municipalities = [...new Set(data.map(function(row) {
                return row.municipality;
            }))];

            // Γεμίζουμε το select με τους δήμους
            municipalities.forEach(function(municipality) {
                var option = document.createElement('option');
                option.value = municipality;
                option.textContent = municipality;
                select.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('❌ Σφάλμα φόρτωσης δήμων:', error);
        });

    // 3. Συνάρτηση για να γεμίσει ο πίνακας
    function fillTable(municipality) {
        // Καθαρίζουμε τον πίνακα
        tbody.innerHTML = '<tr><td colspan="2" class="text-center">Φόρτωση...</td></tr>';

        // Παίρνουμε τα δεδομένα από PHP
        fetch('php/api/get_stats.php?municipality=' + encodeURIComponent(municipality))
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // Καθαρίζουμε τον πίνακα
                tbody.innerHTML = '';

                // Αν δεν υπάρχουν δεδομένα
                if (data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="2" class="text-center">Δεν υπάρχουν αναφορές</td></tr>';
                    return;
                }

                // Γεμίζουμε τον πίνακα με τα δεδομένα
                data.forEach(function(row) {
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + row.category + '</td>' +
                                   '<td>' + row.count + '</td>';
                    tbody.appendChild(tr);
                });
            })
            .catch(function(error) {
                console.error('❌ Σφάλμα φόρτωσης δεδομένων:', error);
                tbody.innerHTML = '<tr><td colspan="2" class="text-center text-danger">Σφάλμα φόρτωσης!</td></tr>';
            });
    }

    // 4. Όταν ο χρήστης αλλάζει δήμο
    select.addEventListener('change', function() {
        fillTable(this.value);
    });

});