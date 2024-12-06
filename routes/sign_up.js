const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Route pour afficher la page d'inscription
router.get('/', (req, res) => {
    res.render('sign_up');
});

// Route pour gérer l'inscription des utilisateurs
router.post('/', async (req, res) => {
    const { first_name, last_name, email, user_password, role, company_name } = req.body;

    // Vérification des champs obligatoires en fonction du rôle
    if (role === 'utilisateur' && (!first_name || !last_name || !email || !user_password)) {
        return res.status(400).send('Tous les champs pour l\'utilisateur sont obligatoires.');
    }

    if (role === 'entreprise' && (!company_name || !email || !user_password)) {
        return res.status(400).send('Le nom de l\'entreprise, l\'email et le mot de passe sont obligatoires pour une entreprise.');
    }

    try {
        // Hacher le mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(user_password, 12);

        // Insertion dans la base de données en fonction du rôle
        const sqlUser = role === 'utilisateur' ?
            'INSERT INTO people (first_name, last_name, email, user_password, role) VALUES (?, ?, ?, ?, ?)' :
            'INSERT INTO people (company_name, email, user_password, role) VALUES (?, ?, ?, ?)';

        const values = role === 'utilisateur' ?
            [first_name, last_name, email, hashedPassword, role] :
            [company_name, email, hashedPassword, role];

        db.query(sqlUser, values, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Cet email est déjà utilisé.');
                }
                console.error('Erreur lors de l\'inscription :', err);
                return res.status(500).send('Erreur serveur.');
            }

            // Créer la session utilisateur après l'inscription
            req.session.user = {
                id: result.insertId,
                first_name: first_name || null,
                last_name: last_name || null,
                company_name: company_name || null,
                email: email,
                role: role
            };

            // Redirection après inscription
            res.redirect('/home');
        });
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        res.status(500).send('Erreur lors de l\'inscription.');
    }
});

module.exports = router;
