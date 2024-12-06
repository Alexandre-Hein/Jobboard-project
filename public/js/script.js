document.addEventListener("DOMContentLoaded", () => {
    // Gestion du profil dropdown
    document.getElementById('profile-btn').addEventListener('click', () => {
        const dropdown = document.getElementById('profile-dropdown');
        dropdown.classList.toggle('show');
    });

    // Fermer le menu déroulant si clic en dehors
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn')) {
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });

    // Gestion des boutons "Afficher plus d'infos"
    const buttons = document.querySelectorAll('.button_info');
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const infoId = button.getAttribute('data-id');
            
            fetch(`/home/${infoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(advertisement => {
                const infoElement = document.querySelector(`#info-${infoId}`);
                if (infoElement) {
                    infoElement.innerHTML = `
                        <h3>${advertisement.title}</h3>
                        <p><strong>Description complète :</strong> ${advertisement.full_description}</p>
                        <p><strong>Salaire :</strong> ${advertisement.salary}</p>
                        <p><strong>Lieu :</strong> ${advertisement.location}</p>
                        <p><strong>Adresse :</strong> ${advertisement.address}</p>
                        <p><strong>Temps de travail :</strong> ${advertisement.working_time}</p>
                    `;
                    infoElement.classList.toggle('show');
                } else {
                    console.error(`Element info-${infoId} not found`);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error); 
            });
        });
    });

    // Gestion des boutons "Postuler"
    const buttonsApply = document.querySelectorAll('.button_add');
    buttonsApply.forEach(button => {
        button.addEventListener("click", () => {
            const adId = button.getAttribute('data-id');
            const form = document.getElementById(`apply-form-${adId}`);
            if (form) {
                form.style.display = form.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
});
