
// REPORT.JS - EcoCity


// Περιμένουμε να φορτώσει η σελίδα πρώτα
document.addEventListener('DOMContentLoaded', function() {

    // 1. Εύρεση στοιχείων φόρμας
    var selects     = document.querySelectorAll('select');
    var category    = selects[0];   // πρώτο select = Κατηγορία
    var severity    = selects[1];   // δεύτερο select = Σοβαρότητα
    var description = document.querySelector('textarea');
    var submitBtn   = document.querySelector('button');

    // 2. Όταν ο χρήστης πατήσει το κουμπί Υποβολή
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();  // Σταματάμε την ανανέωση σελίδας

        // Διαβάζουμε τις τιμές της φόρμας
        var categoryValue    = category.value;
        var severityValue    = severity.value;
        var descriptionValue = description.value;

        // Έλεγχος αν η περιγραφή είναι κενή
        if (!descriptionValue) {
            alert('⚠️ Παρακαλώ συμπλήρωσε την περιγραφή!');
            return;
        }

        // Δημιουργία αντικειμένου αναφοράς
        var report = {
            category:    categoryValue,
            severity:    severityValue,
            description: descriptionValue
        };

        // Εκτύπωση στο console για debugging
        console.log('📋 Νέα Αναφορά:', report);

        // Μήνυμα επιτυχίας
        alert('✅ Η αναφορά υποβλήθηκε επιτυχώς!');
    });

});