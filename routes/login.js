const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {
    const { email, user_password } = req.body;

    // Requête pour récupérer l'utilisateur avec l'email donné
    const sql = 'SELECT * FROM people WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Erreur lors de la connexion :', err);
            return res.status(500).send('Erreur du serveur');
        }

        // Vérifie si un utilisateur avec cet email existe
        if (results.length === 0) {
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        const user = results[0];

        // Comparer le mot de passe donné avec le mot de passe haché stocké dans la base de données
        const passwordMatch = await bcrypt.compare(user_password, user.user_password);

        if (!passwordMatch) {
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        // Stocker l'utilisateur dans la session en fonction du rôle
        req.session.user = {
            id: user.id,
            first_name: user.role === 'utilisateur' ? user.first_name : null,
            last_name: user.role === 'utilisateur' ? user.last_name : null,
            company_name: user.role === 'entreprise' ? user.company_name : null,
            email: user.email,
            role: user.role
        };

        // Rediriger en fonction du rôle de l'utilisateur
        if (user.role === 'admin') {
            return res.redirect('/admin');
        } else if (user.role === 'entreprise') {
            return res.redirect('/entreprise');
        } else {
            return res.redirect('/home');
        }
    });
});

module.exports = router;
