const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Middleware pour vérifier si l'utilisateur est connecté
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/connexion');
}

// Route pour afficher le profil en fonction du rôle
router.get('/', isAuthenticated, (req, res) => {
    const user = req.session.user;

    const sql = 'SELECT * FROM people WHERE id = ?';
    db.query(sql, [user.id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du profil :', err);
            return res.status(500).send('Erreur serveur');
        }

        if (results.length === 0) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        const user = results[0];

        if (user.role === 'admin') {
            res.render('adminProfile', { user });
        } else if (user.role === 'entreprise') {
            res.render('companyProfile', { user });
        } else {
            res.render('userProfile', { user });
        }
    });
});

// Route pour modifier les informations du profil
router.post('/update', isAuthenticated, async (req, res) => {
    const { first_name, last_name, phone, email, user_password } = req.body;
    const userId = req.session.user.id;

    // Hachage du mot de passe avant la mise à jour (si modifié)
    let hashedPassword = req.session.user.user_password;
    if (user_password && user_password.trim() !== "") {
        hashedPassword = await bcrypt.hash(user_password, 12);
    }

    const sql = 'UPDATE people SET first_name = ?, last_name = ?, phone = ?, email = ?, user_password = ? WHERE id = ?';
    const values = [first_name, last_name, phone, email, hashedPassword, userId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du profil :', err);
            return res.status(500).send('Erreur lors de la mise à jour.');
        }
        // Mettre à jour les informations de session
        req.session.user = { ...req.session.user, first_name, last_name, phone, email };
        res.redirect('/profil');
    });
});

// Route pour supprimer un utilisateur
router.get('/delete', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    // Commence par supprimer les candidatures de l'utilisateur
    const deleteApplicationsSql = 'DELETE FROM applications WHERE people_id = ?';
    db.query(deleteApplicationsSql, [userId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression des candidatures :', err);
            return res.status(500).send('Erreur lors de la suppression des candidatures.');
        }

        // Ensuite, supprime l'utilisateur
        const deleteUserSql = 'DELETE FROM people WHERE id = ?';
        db.query(deleteUserSql, [userId], (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression du compte :', err);
                return res.status(500).send('Erreur lors de la suppression du compte.');
            }

            // Détruire la session après la suppression du compte
            req.session.destroy(() => {
                res.redirect('/connexion'); // Redirection après suppression
            });
        });
    });
});




module.exports = router;
