const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour afficher la liste des annonces
router.get('/', (req, res) => {
    // Jointure entre advertisements et people pour récupérer le nom de l'entreprise
    const sql = `
        SELECT advertisements.*, people.company_name 
        FROM advertisements 
        JOIN people ON advertisements.people_id = people.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err);
            return res.status(500).send('Erreur lors de la récupération des annonces');
        }

        res.render('advertisements', {
            advertisements: results,
            user: req.session.user
        });
    });
});

// Route pour afficher les détails d'une annonce spécifique
router.get('/:id', (req, res) => {
    const sql = `
        SELECT advertisements.title, advertisements.full_description, advertisements.salary, 
               advertisements.location, advertisements.address, advertisements.working_time, 
               people.company_name
        FROM advertisements
        JOIN people ON advertisements.people_id = people.id
        WHERE advertisements.id = ?
    `;
    
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des détails de l\'annonce :', err);
            return res.status(500).send('Erreur lors de la récupération des détails de l\'annonce');
        }
        if (result.length === 0) {
            return res.status(404).send('Annonce non trouvée');
        }
        res.json(result[0]);
    });
});

module.exports = router;
