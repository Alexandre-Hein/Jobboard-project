function isEntreprise(req, res, next) {
    if (req.session.user && req.session.user.role === 'entreprise') {
        return next(); // Si l'utilisateur est une entreprise, on continue
    }
    res.redirect('/connexion'); // Si non, redirection vers la connexion
}

module.exports = isEntreprise;
