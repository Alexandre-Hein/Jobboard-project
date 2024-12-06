
# Job Board Project

## Description
Ce projet est une application de job board construite avec Node.js, Express, MySQL et EJS pour gérer les annonces d'emploi, les entreprises et les candidatures.

## Prérequis
Avant de commencer, assurez-vous d'avoir installé les logiciels suivants :

- [Node.js](https://nodejs.org/) (v14.x ou supérieur)
- [MySQL](https://www.mysql.com/)
- [MySQL_WorkBench](https://www.mysql.com/products/workbench/)

## Installation

1. **Cloner le dépôt**
   Si le projet est hébergé sur un dépôt Git, vous pouvez le cloner avec la commande suivante :

   ```bash
   git clone git@github.com:Alexandre-Hein/Jobboard-project.git
   ```

2. **Naviguer dans le répertoire du projet**

   Allez dans le répertoire du projet :

   ```bash
   cd Jobboard-project
   ```

3. **Installer les dépendances**

   Exécutez la commande suivante pour installer toutes les dépendances répertoriées dans le fichier `package.json` :

   ```bash
   npm install
   ```

## Configuration de la base de données

1. **Créer la base de données MySQL**

   Assurez-vous que MySQL est installé et en cours d'exécution. Utilisez le fichier `job_board.sql` pour créer la base de données et les tables nécessaires.

   - Ouvrez votre client MySQL (ou MySQL Workbench) et exécutez le fichier `job_board.sql` :

   ```sql
   SOURCE chemin/vers/job_board.sql;
   ```

2. **Configurer la connexion MySQL**

   Modifiez le fichier `db.js` dans le projet pour configurer les informations de connexion à votre base de données MySQL (host, user, password, database).

## Importation des données de la base de données

Pour que vous ayez exactement les mêmes données que moi dans votre base de données MySQL, vous devez importer le fichier `sql1.sql` dans MySQL Workbench. Voici les étapes à suivre :

1. **Ouvrir MySQL Workbench** :
   - Lancez MySQL Workbench et connectez-vous à votre instance MySQL.

2. **Créer une nouvelle base de données** :
   - Si ce n'est pas déjà fait, créez une nouvelle base de données vide pour le projet en exécutant la commande suivante dans une nouvelle requête :
   ```sql
   CREATE DATABASE job_board;
   ```

3. **Importer le fichier `sql1.sql`** :
   - Ouvrez MySQL Workbench et connectez-vous à votre serveur MySQL.
   - Une fois connecté, accédez à la section `Server` dans le panneau latéral gauche et sélectionnez `Data Import`.
   - Dans la section `Import Options`, sélectionnez `Import from Self-Contained File` et cliquez sur `Browse` pour localiser le fichier `sql1.sql` sur votre ordinateur.
   - Assurez-vous que la bonne base de données (par exemple, `job_board`) est sélectionnée dans la section `Default Target Schema`. Si la base de données n'existe pas encore, vous pouvez cocher l'option `New` et spécifier le nom de la base de données à créer.
   - Cliquez ensuite sur le bouton `Start Import` pour importer les données dans votre base de données.

4. **Vérification de l'importation** :
   - Une fois le script exécuté, vous pouvez vérifier que les tables et les données ont bien été créées en accédant à la section `Schemas` sur la gauche et en ouvrant la base de données `job_board`.

En suivant ces étapes, votre base de données devrait contenir toutes les données nécessaires pour exécuter le projet correctement. 

## Exécution du projet

1. **Démarrer le serveur**

   Une fois les dépendances installées et la base de données configurée, vous pouvez démarrer l'application avec la commande suivante :

   ```bash
   npm start
   ```

   Le serveur démarre normalement sur `http://localhost:3000`. Vous pouvez changer le port si nécessaire dans le fichier `app.js`.

## Fonctionnalités principales

- Inscription et connexion des utilisateurs (avec les rôles admin, entreprise, et utilisateur).
- Gestion des entreprises et des annonces d'emploi.
- Envoi de candidatures pour les offres d'emploi disponibles.
- Affichage des offres et des candidatures.

## Structure du projet

- **app.js** : Fichier principal pour démarrer l'application.
- **db.js** : Fichier pour la connexion à la base de données MySQL.
- **routes/** : Contient les routes pour l'API (gestion des utilisateurs, annonces, candidatures, etc.).
- **views/** : Contient les vues EJS pour le rendu des pages HTML.
- **public/** : Dossier pour les fichiers statiques (CSS, images, etc.).

## Dépendances

Les dépendances principales du projet sont :

- **bcrypt** : `^5.1.1` (pour le hachage des mots de passe)
- **body-parser** : `^1.20.3` (pour l'analyse des données POST)
- **ejs** : `^3.1.10` (pour le rendu des vues)
- **express** : `^4.21.0` (framework web pour Node.js)
- **express-mysql-session** : `^3.0.3` (pour stocker les sessions en MySQL)
- **express-session** : `^1.18.1` (pour la gestion des sessions utilisateur)
- **mysql2** : `^3.11.3` (pour la connexion à MySQL)

## Connexion Compte Admin

- Email: admin@admin.com
- Mot de passe: "1478"
