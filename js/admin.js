// ============================
// ADMIN.JS - EcoCity
// ============================

document.addEventListener('DOMContentLoaded', function() {

    // 1. Εύρεση πίνακα
    var tbody = document.querySelector('tbody');

    // 2. Φόρτωση όλων των αναφορών από PHP
    function loadReports() {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Φόρτωση...</td></tr>';

        fetch('php/api/get_reports.php')
            .then(function(response) {
                return response.json();
            })
            .then(function(reports) {
                // Καθαρίζουμε τον πίνακα
                tbody.innerHTML = '';

                // Αν δεν υπάρχουν αναφορές
                if (reports.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Δεν υπάρχουν αναφορές</td></tr>';
                    return;
                }

                // Γεμίζουμε τον πίνακα με τις αναφορές
                reports.forEach(function(report) {
                    var tr = document.createElement('tr');
                    tr.innerHTML =
                        '<td>' + report.id + '</td>' +
                        '<td>' + report.description + '</td>' +
                        '<td>' + report.status + '</td>' +
                        '<td>' +
                            '<button class="btn btn-sm btn-warning me-2" ' +
                                'onclick="updateReport(' + report.id + ')">Ενημέρωση</button>' +
                            '<button class="btn btn-sm btn-danger" ' +
                                'onclick="deleteReport(' + report.id + ')">Διαγραφή</button>' +
                        '</td>';
                    tbody.appendChild(tr);
                });
            })
            .catch(function(error) {
                console.error('❌ Σφάλμα φόρτωσης αναφορών:', error);
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Σφάλμα φόρτωσης!</td></tr>';
            });
    }

    // 3. Ενημέρωση status αναφοράς
    window.updateReport = function(id) {
        // Επιλογή νέου status
        var newStatus = prompt('Νέο status: (pending / in_progress / resolved)');

        // Αν ο χρήστης πάτησε cancel
        if (!newStatus) return;

        // Στέλνουμε στο PHP
        fetch('php/admin/update_report.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id:     id,
                status: newStatus
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                alert('✅ Το status ενημερώθηκε!');
                // Ξαναφορτώνουμε τον πίνακα
                loadReports();
            } else {
                alert('❌ ' + data.message);
            }
        })
        .catch(function(error) {
            console.error('❌ Σφάλμα ενημέρωσης:', error);
        });
    }

    // 4. Διαγραφή αναφοράς
    window.deleteReport = function(id) {
        // Επιβεβαίωση διαγραφής
        var confirm = window.confirm('Σίγουρα θέλεις να διαγράψεις την αναφορά;');

        // Αν ο χρήστης πάτησε cancel
        if (!confirm) return;

        // Στέλνουμε στο PHP
        fetch('php/admin/delete_report.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                alert('✅ Η αναφορά διαγράφηκε!');
                // Ξαναφορτώνουμε τον πίνακα
                loadReports();
            } else {
                alert('❌ ' + data.message);
            }
        })
        .catch(function(error) {
            console.error('❌ Σφάλμα διαγραφής:', error);
        });
    }

    // 5. Πρώτη φόρτωση
    loadReports();

});