const express = require('express');
const router = express.Router();

// Route pour gérer la déconnexion
router.get('/', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erreur lors de la destruction de la session :', err);
                return res.status(500).send('Erreur lors de la déconnexion.');
            }
            res.redirect('/home');
        });
    } else {
        res.redirect('/home');
    }
});

module.exports = router;
