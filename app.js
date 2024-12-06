const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'job_board'
});

app.use(session({
  secret: 'monSecretSuperSecurise',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 60 * 60 * 1000 
  }
}));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Middleware pour rendre l'objet `user` disponible dans toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Middleware d'authentification pour vérifier si l'utilisateur est admin
const isAdmin = require('./middleware/isAdmin');
app.get('/admin', isAdmin, (req, res) => {
    res.render('admin');
});

// Middleware d'authentification pour vérifier si l'utilisateur est entreprise
const isEntreprise = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'entreprise') {
      return next();
  } else {
      res.redirect('/connexion');
  }
};
app.get('/entreprise', (req, res) => {
  console.log('Session User:', req.session.user); // Vérifie que company_id est bien défini
  if (req.session.user && req.session.user.role === 'entreprise') {
      res.render('entreprise', { user: req.session.user });
  } else {
      res.redirect('/connexion');
  }
});


// Route de connexion
const loginRoutes = require('./routes/login');
app.use('/connexion', loginRoutes);

// Route d'inscription
const sign_upRoutes = require('./routes/sign_up');
app.use('/inscription', sign_upRoutes);

const profilRoutes = require('./routes/profil');
app.use('/profil', profilRoutes);

const applyRoutes = require('./routes/apply');
app.use('/apply', applyRoutes);

const logoutRoutes = require('./routes/logout');
app.use('/deconnexion', logoutRoutes);

// Route pour les annonces
const advertisementsRoutes = require('./routes/advertisements');
app.use('/home', advertisementsRoutes);

// API Routes pour les annonces et utilisateurs
const advertisementsApi = require('./routes/api/advertisementsApi');
app.use('/api', advertisementsApi);

const peopleApi = require('./routes/api/peopleApi');
app.use('/api', peopleApi);

// Utilisation des routes API
app.set('views', __dirname + '/views');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
});
