const express = require('express');
const router = express.Router();
const db = require('../db');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/connexion');
}

// Route pour soumettre une candidature
router.post('/:id', (req, res) => {
    const advertisementId = req.params.id;
    const { user_id, message } = req.body;

    if (!user_id || !message) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    // Insertion de la candidature dans la base de données
    const sql = 'INSERT INTO applications (people_id, advertisement_id, message) VALUES (?, ?, ?)';
    db.query(sql, [user_id, advertisementId, message], (err, result) => {
        if (err) {
            console.error('Erreur lors de la soumission de la candidature :', err);
            return res.status(500).send('Erreur serveur');
        }
        res.redirect('/home');
    });
});

// Route pour afficher toutes les candidatures reçues par une entreprise
router.get('/company/:people_id/applications', (req, res) => {
    const peopleId = req.params.people_id;

    // Vérifie que l'utilisateur est connecté et qu'il s'agit bien de l'entreprise accédant à ses propres candidatures
    if (!req.session.user || req.session.user.id != peopleId || req.session.user.role !== 'entreprise') {
        return res.status(403).send('Accès non autorisé');
    }
    const sql = `
        SELECT a.message, p.first_name, p.last_name, p.email, p.phone, a.applied_at
        FROM applications a
        JOIN people p ON a.people_id = p.id
        JOIN advertisements ad ON a.advertisement_id = ad.id
        WHERE ad.people_id = ?`;

    db.query(sql, [peopleId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des candidatures :', err);
            return res.status(500).send('Erreur serveur');
        }

        res.render('companyApplications', { applications: results });
    });
});

// Route pour afficher les candidatures envoyées par l'utilisateur connecté
router.get('/user/:user_id/applications', (req, res) => {
    const userId = req.params.user_id;

    // Vérifie que l'utilisateur est connecté
    if (!req.session.user) {
        return res.status(401).send('Vous devez être connecté pour accéder à cette page.');
    }

    // Vérifie que l'utilisateur accède à ses propres candidatures
    if (req.session.user.id !== parseInt(userId)) {
        return res.status(403).send('Accès refusé. Vous ne pouvez consulter que vos propres candidatures.');
    }
    const sql = `
        SELECT a.message, ad.title, a.applied_at
        FROM applications a
        JOIN advertisements ad ON a.advertisement_id = ad.id
        WHERE a.people_id = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des candidatures :', err);
            return res.status(500).send('Erreur serveur.');
        }

        // Vérifie si des résultats sont renvoyés
        if (results.length === 0) {
            return res.status(404).send('Aucune candidature trouvée.');
        }
        res.render('applications', { applications: results });
    });
});

module.exports = router;
