console.log("JavaScript chargé avec succès");
// Afficher/Masquer le menu déroulant du profil
document.getElementById('profile-btn').addEventListener('click', function() {
    const dropdown = document.getElementById('profile-dropdown');
    console.log('Le bouton Profil a été cliqué');

    // Vérifie l'état d'affichage actuel
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
});

// Fermer le menu si l'utilisateur clique en dehors de celui-ci
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
};



// Afficher/Masquer le formulaire d'ajout d'annonce
document.getElementById('add-ad-btn').addEventListener('click', function() {
    const adForm = document.getElementById('add-ad-form');
    adForm.classList.toggle('hidden');
});

// Gérer l'ajout d'annonces
document.getElementById('ad-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const adData = {
        title: document.getElementById('title').value,
        short_description: document.getElementById('short_description').value,
        salary: document.getElementById('salary').value,
        location: document.getElementById('location').value
    };

    fetch('/api/advertisements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Annonce ajoutée');
        loadAds();
    })
    .catch(error => console.error('Erreur lors de l\'ajout de l\'annonce:', error));
});

// Charger les annonces
function loadAds() {
    fetch('/api/advertisements')
    .then(response => response.json())
    .then(data => {
        const adsContainer = document.getElementById('ads-container');
        adsContainer.innerHTML = '';
        data.forEach(ad => {
            adsContainer.innerHTML += `
                <tr>
                    <td>${ad.title}</td>
                    <td>${ad.short_description}</td>
                    <td>${ad.salary}</td>
                    <td>${ad.location}</td>
                    <td>
                        <button onclick="deleteAd(${ad.id})">Supprimer</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => console.error('Erreur lors du chargement des annonces:', error));
}

// Supprimer une annonce
function deleteAd(adId) {
    fetch(`/api/advertisements/${adId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Annonce supprimée');
        loadAds();
    })
    .catch(error => console.error('Erreur lors de la suppression de l\'annonce:', error));
}

// Afficher/Masquer le formulaire d'ajout d'utilisateur
document.getElementById('add-user-btn').addEventListener('click', function() {
    const userForm = document.getElementById('add-user-form');
    userForm.classList.toggle('hidden');
});

// Gérer l'ajout d'utilisateurs
document.getElementById('add-user-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        user_password: document.getElementById('user_password').value,
        role: document.getElementById('role').value
    };

    fetch('/api/people', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Utilisateur ajouté');
        loadUsers();
    })
    .catch(error => console.error('Erreur lors de l\'ajout de l\'utilisateur:', error));
});

// Charger les utilisateurs
function loadUsers() {
    fetch('/api/people')
        .then(response => response.json())
        .then(data => {
            const usersContainer = document.getElementById('users-container');
            usersContainer.innerHTML = '';
            data.forEach(user => {
                usersContainer.innerHTML += `
                    <tr>
                        <td>${user.first_name}</td>
                        <td>${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button onclick="deleteUser(${user.id})">Supprimer</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));
}

// Supprimer un utilisateur
function deleteUser(userId) {
    fetch(`/api/people/${userId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Utilisateur supprimé');
        loadUsers();
    })
    .catch(error => console.error('Erreur lors de la suppression de l\'utilisateur:', error));
}

// Charger les annonces et les utilisateurs au démarrage de la page
window.onload = function() {
    loadAds();
    loadUsers();
};
