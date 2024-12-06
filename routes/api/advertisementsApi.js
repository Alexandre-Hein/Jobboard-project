const express = require('express');
const router = express.Router();
const db = require('../../db');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/connexion');
}

// Récupérer toutes les annonces
router.get('/advertisements', (req, res) => {
    const sql = 'SELECT * FROM advertisements';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Récupérer les annonces pour une entreprise spécifique (par people_id)
router.get('/advertisements/people/:people_id', isAuthenticated,(req, res) => {
    const peopleId = req.params.people_id;
    const user = req.session.user;
    const sql = 'SELECT * FROM advertisements WHERE people_id = ?';
    
    db.query(sql, [peopleId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});



// Ajouter une annonce
router.post('/advertisements', (req, res) => {
    const { title, short_description, full_description, salary, location, address, working_time } = req.body;
    const people_id = req.session.user.id;

    const sql = 'INSERT INTO advertisements (title, short_description, full_description, salary, location, address, working_time, people_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [title, short_description, full_description, salary, location, address, working_time, people_id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Annonce ajoutée avec succès' });
    });
});



// Modifier une annonce
router.put('/advertisements/:id', (req, res) => {
    const { title, short_description, full_description, salary, location, address, working_time } = req.body;
    const sql = 'UPDATE advertisements SET title = ?, short_description = ?, full_description = ?, salary = ?, location = ?, address = ?, working_time = ? WHERE id = ?';
    const values = [title, short_description, full_description, salary, location, address, working_time, req.params.id];
    
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Annonce mise à jour avec succès' });
    });
});

// Supprimer une annonce et les candidatures associées
router.delete('/advertisements/:id', (req, res) => {
    const advertisementId = req.params.id;

    // Supprimer d'abord les candidatures associées à cette annonce
    const sqlDeleteApplications = 'DELETE FROM applications WHERE advertisement_id = ?';
    db.query(sqlDeleteApplications, [advertisementId], (err) => {
        if (err) {
            console.error('Erreur lors de la suppression des candidatures associées:', err);
            return res.status(500).json({ error: 'Erreur lors de la suppression des candidatures associées.' });
        }

        // Ensuite, supprimer l'annonce
        const sqlDeleteAdvertisement = 'DELETE FROM advertisements WHERE id = ?';
        db.query(sqlDeleteAdvertisement, [advertisementId], (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression de l\'annonce:', err);
                return res.status(500).json({ error: 'Erreur lors de la suppression de l\'annonce.' });
            }

            res.status(200).json({ message: 'Annonce et candidatures supprimées avec succès.' });
        });
    });
});


module.exports = router;
