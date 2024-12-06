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
        full_description: document.getElementById('full_description').value,
        salary: document.getElementById('salary').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        working_time: document.getElementById('working_time').value,
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
    .catch(error => console.error('Erreur lors de l\'ajout:', error));
});


// Charger les annonces
function loadAds() {
    const peopleId = user.id;

    fetch(`/api/advertisements/people/${peopleId}`)
        .then(response => response.json())
        .then(data => {
            const adsContainer = document.getElementById('ads-container');
            adsContainer.innerHTML = '';
            if (data.length > 0) {
                data.forEach(ad => {
                    adsContainer.innerHTML += `
                        <tr>
                            <td>${ad.title}</td>
                            <td>${ad.short_description}</td>
                            <td>${ad.salary}</td>
                            <td>${ad.location}</td>
                            <td>${ad.address}</td>
                            <td>${ad.working_time}</td>
                            <td><button onclick="deleteAd(${ad.id})">Supprimer</button></td>
                        </tr>
                    `;
                });
            } else {
                adsContainer.innerHTML = '<tr><td colspan="7">Aucune annonce trouvée.</td></tr>';
            }
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
        alert('Annonce et candidatures supprimées avec succès');
        loadAds();
    })
    .catch(error => console.error('Erreur lors de la suppression:', error));
}


window.onload = function() {
    loadAds();
}
