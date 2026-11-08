/* ================= PRODUITS ================= */

const ajout = document.getElementById("btn-ajouter");
const annuler = document.getElementById("btn-annuler");
const fermer = document.getElementById("btn-fermer");
const formulaire = document.getElementById("formulaire");
const enregistrer = document.getElementById("btn-enregistrer");
const tableau = document.getElementById("tableau");

let produits = chargerProduits();

function sauvegarder() {
    localStorage.setItem('produits', JSON.stringify(produits));
}

function afficherTableau() {
    tableau.innerHTML = "";
    produits.forEach((el, index) => {
        const ligne = `
            <tr>
                <td><img src="${el.image}" style="width:60px;"></td>
                <td>${el.libelle}</td>
                <td>${el.categorie || '-'}</td>
                <td>${Number(el.prix).toLocaleString('fr-FR')} FCFA</td>
                <td>${el.stock}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-supprimer" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableau.insertAdjacentHTML('beforeend', ligne);
    });
    document.querySelectorAll('.btn-supprimer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const i = e.currentTarget.dataset.index;
            const confirmation = confirm(`Voulez-vous vraiment supprimer "${produits[i].libelle}" ?`);
            if (confirmation) {
                produits.splice(i, 1);
                sauvegarder();
                afficherTableau();
            }
        });
    });
}
afficherTableau();

document.getElementById('btn-reinit').addEventListener('click', () => {
    if (confirm("Remettre le catalogue par défaut ?")) {
        localStorage.removeItem('produits');
        produits = chargerProduits();
        afficherTableau();
    }
});

ajout.addEventListener('click', () => formulaire.classList.remove('d-none'));
annuler.addEventListener('click', () => formulaire.classList.add('d-none'));
fermer.addEventListener('click', () => formulaire.classList.add('d-none'));

enregistrer.addEventListener('click', () => {
    const nouveauProduit = {
        image: document.getElementById("image").value,
        libelle: document.getElementById("nom").value,
        description: document.getElementById("Description").value,
        categorie: document.getElementById("Categorie").value,
        prix: Number(document.getElementById("Prix").value),
        stock: Number(document.getElementById("Stock").value)
    };

    produits = chargerProduits();
    produits.push(nouveauProduit);
    sauvegarder();
    afficherTableau();
    formulaire.classList.add('d-none');
});

/* ================= COLIS ================= */

let colis = JSON.parse(localStorage.getItem('listeColis')) || [];
const ETAPES = ["Enregistré", "Pris en charge", "En transit", "Arrivé à destination", "Livré"];
let numeroSelectionne = null;

function classeStatut(statut) {
    if (statut == "Enregistré") return "bg-secondary";
    if (statut == "Pris en charge") return "bg-info";
    if (statut == "En transit") return "bg-warning text-dark";
    if (statut == "Arrivé à destination") return "bg-primary";
    if (statut == "Livré") return "bg-success";
}

function dateHeureActuelle() {
    let d = new Date();
    return d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 8);
}

function genererNumeroColis() {
    const annee = new Date().getFullYear();
    return "COL-" + annee + "-" + Math.floor(1000 + Math.random() * 9000);
}

function saveColisLS() {
    localStorage.setItem("listeColis", JSON.stringify(colis));
}

let tableColis = $('#tableColis').DataTable({
    data: colis,
    pageLength: 5,
    dom: 'rtip',
    columns: [
        { data: 'numero' },
        { data: 'client' },
        { data: 'telephone' },
        { data: 'description' },
        {
            data: 'statut',
            render: function (statut) {
                return '<span class="badge ' + classeStatut(statut) + '">' + statut + '</span>';
            }
        },
        {
            data: null,
            render: function (c) {
                return '<button class="btn btn-warning btn-sm" onclick="suiviColis(\'' + c.numero + '\')">Suivi</button>';
            }
        }
    ],
    language: {
        search: "Rechercher :",
        info: "Affichage _START_ à _END_ sur _TOTAL_",
        infoEmpty: "Aucun colis",
        infoFiltered: "(filtré sur _MAX_ colis au total)",
        zeroRecords: "Aucun colis ne correspond à ce filtre",
        paginate: { previous: "<< Précédent", next: "Suivant >>", first: "«", last: "»" }
    },
    pagingType: "full_numbers"
});

document.getElementById('rechercheColis').onkeyup = function () {
    tableColis.search(this.value).draw();
};

document.getElementById('filtreStatutColis').onchange = function () {
    tableColis.column(4).search(this.value, false, false).draw();
};

function ajouterColis() {
    const client = document.getElementById('colisClientInput').value;
    const telephone = document.getElementById('colisTelephoneInput').value;
    const description = document.getElementById('colisDescriptionInput').value;

    if (client == "" || telephone == "") {
        alert('Le client et le téléphone sont obligatoires !');
        return;
    }

    const nouveauColis = {
        numero: genererNumeroColis(),
        client: client,
        telephone: telephone,
        description: description,
        statut: "Enregistré",
        historique: [{ statut: "Enregistré", date: dateHeureActuelle() }]
    };

    colis = JSON.parse(localStorage.getItem('listeColis')) || [];
    colis.push(nouveauColis);
    saveColisLS();

    tableColis.clear();
    tableColis.rows.add(colis);
    tableColis.draw();

    document.getElementById('colisClientInput').value = "";
    document.getElementById('colisTelephoneInput').value = "";
    document.getElementById('colisDescriptionInput').value = "";
}

function trouverColis(num) {
    return colis.find(c => c.numero == num);
}

function suiviColis(num) {
    numeroSelectionne = num;
    afficherDetailColis();
    document.getElementById('vueListeColis').style.display = 'none';
    document.getElementById('vueDetailColis').style.display = 'block';
}

function afficherDetailColis() {
    let c = trouverColis(numeroSelectionne);

    document.getElementById('detailNumeroColis').textContent = c.numero;
    document.getElementById('detailClientColis').textContent = c.client;
    document.getElementById('detailStatutColis').innerHTML =
        '<span class="badge ' + classeStatut(c.statut) + '">' + c.statut + '</span>';

    if (c.statut == "Livré") {
        document.getElementById('messageLivreColis').style.display = 'block';
        document.getElementById('zoneMiseAJourColis').style.display = 'none';
    } else {
        document.getElementById('messageLivreColis').style.display = 'none';
        document.getElementById('zoneMiseAJourColis').style.display = 'block';

        let indexActuel = ETAPES.indexOf(c.statut);
        let select = document.getElementById('selectEtapeColis');
        select.innerHTML = '';
        for (let i = indexActuel + 1; i < ETAPES.length; i++) {
            select.innerHTML += '<option>' + ETAPES[i] + '</option>';
        }
    }

    let historique = document.getElementById('listeHistoriqueColis');
    historique.innerHTML = '';
    for (let i = c.historique.length - 1; i >= 0; i--) {
        historique.innerHTML += `
            <div class="timeline-item">
                <strong>${c.historique[i].statut}</strong><br>
                <small class="text-muted">${c.historique[i].date}</small>
            </div>
        `;
    }
}

function mettreAJourColis() {
    colis = JSON.parse(localStorage.getItem('listeColis')) || [];
    let c = trouverColis(numeroSelectionne);
    let valeur = document.getElementById('selectEtapeColis').value;

    if (c.statut != "Livré" && valeur != "") {
        c.statut = valeur;
        c.historique.push({ statut: valeur, date: dateHeureActuelle() });
        saveColisLS();

        tableColis.clear();
        tableColis.rows.add(colis);
        tableColis.draw();

        afficherDetailColis();
    }
}

function retourColis() {
    document.getElementById('vueDetailColis').style.display = 'none';
    document.getElementById('vueListeColis').style.display = 'block';
}

function btnDashboardColis() {
    afficherDashboardColis();
    document.getElementById('vueListeColis').style.display = 'none';
    document.getElementById('vueDashboardColis').style.display = 'block';
}

function retourDashboardColis() {
    document.getElementById('vueDashboardColis').style.display = 'none';
    document.getElementById('vueListeColis').style.display = 'block';
}

document.querySelector('button[data-bs-target="#ongletColis"]').addEventListener('shown.bs.tab', function () {
    tableColis.columns.adjust().draw();
});

function afficherDashboardColis() {
    document.getElementById('colisLivresAdmin').textContent = colis.filter(c => c.statut == "Livré").length;
    document.getElementById('colisTransitAdmin').textContent = colis.filter(c => c.statut == "En transit").length;
    document.getElementById('colisArrivesAdmin').textContent = colis.filter(c => c.statut == "Arrivé à destination").length;
}

// Met l'admin à jour quand une commande arrive depuis une autre page/onglet
window.addEventListener('storage', () => {
    produits = chargerProduits();
    afficherTableau();
    colis = JSON.parse(localStorage.getItem('listeColis')) || [];
    tableColis.clear();
    tableColis.rows.add(colis);
    tableColis.draw();
});