function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); // Si l'utilisateur est un admin, on continue
    }
    res.redirect('/connexion'); // Si non, redirection vers la connexion
}

module.exports = isAdmin;
