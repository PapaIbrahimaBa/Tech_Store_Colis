let colis = JSON.parse(localStorage.getItem('listeColis')) || [];

function classeStatut(statut) {
    if (statut == "Enregistré") return "bg-secondary";
    if (statut == "Pris en charge") return "bg-info";
    if (statut == "En transit") return "bg-warning text-dark";
    if (statut == "Arrivé à destination") return "bg-primary";
    if (statut == "Livré") return "bg-success";
}

function trouverColis(num) {
    return colis.find(c => c.numero.toLowerCase() == num.toLowerCase());
}

function rechercherColis() {
    const num = document.getElementById('numeroRecherche').value.trim();
    const c = trouverColis(num);

    if (!c) {
        document.getElementById('resultatColis').style.display = 'none';
        document.getElementById('messageErreur').style.display = 'block';
        return;
    }

    document.getElementById('messageErreur').style.display = 'none';
    document.getElementById('colisNumero').textContent = c.numero;
    document.getElementById('colisClient').textContent = c.client;
    document.getElementById('colisDescription').textContent = c.description;

    const badge = document.getElementById('colisStatutBadge');
    badge.textContent = c.statut;
    badge.className = "badge fs-6 " + classeStatut(c.statut);

    const historique = document.getElementById('colisHistorique');
    historique.innerHTML = '';
    for (let i = c.historique.length - 1; i >= 0; i--) {
        historique.innerHTML += `
            <div class="timeline-item">
                <strong>${c.historique[i].statut}</strong><br>
                <small class="text-muted">${c.historique[i].date}</small>
            </div>
        `;
    }

    document.getElementById('resultatColis').style.display = 'block';
}

// Si on arrive depuis "Suivre mon colis" avec ?numero=COL-xxxx
const params = new URLSearchParams(window.location.search);
const numeroAuto = params.get('numero');
if (numeroAuto) {
    document.getElementById('numeroRecherche').value = numeroAuto;
    rechercherColis();
}
