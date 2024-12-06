const express = require('express');
const router = express.Router();
const db = require('../../db');

// Route pour récupérer tous les utilisateurs
router.get('/people', (req, res) => {
    const sql = 'SELECT * FROM people';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Route pour récupérer un utilisateur spécifique par ID
router.get('/people/:id', (req, res) => {
    const sql = 'SELECT * FROM people WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json(result[0]);
    });
});

// Route pour ajouter un nouvel utilisateur
router.post('/people', (req, res) => {
    const { first_name, last_name, email, user_password, role } = req.body;

    // Requête SQL pour insérer un nouvel utilisateur dans la base de données
    const sql = 'INSERT INTO people (first_name, last_name, email, user_password, role) VALUES (?, ?, ?, ?, ?)';
    const values = [first_name, last_name, email, user_password, role];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', err);
            return res.status(500).send('Erreur lors de l\'ajout');
        }
        // Retourne un message de succès et l'ID du nouvel utilisateur
        res.json({ message: 'Utilisateur ajouté avec succès', id: result.insertId });
    });
});

// Route pour mettre à jour les informations d'un utilisateur par ID
router.put('/people/:id', (req, res) => {
    const { first_name, last_name, email, user_password } = req.body;
    const sql = 'UPDATE people SET first_name = ?, last_name = ?, email = ?, user_password = ? WHERE id = ?';
    const values = [first_name, last_name, email, user_password, req.params.id];
    
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    });
});

// Route pour supprimer un utilisateur par ID
router.delete('/people/:id', (req, res) => {
    const sql = 'DELETE FROM people WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    });
});

module.exports = router;
