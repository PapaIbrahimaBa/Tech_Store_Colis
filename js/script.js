const zoneProduits = document.querySelector('#zone-produits');
let produits = chargerProduits();
let colis = JSON.parse(localStorage.getItem('listeColis')) || [];
let panier = JSON.parse(localStorage.getItem('panier')) || [];

function affichageProduits(liste) {
    zoneProduits.innerHTML = "";
    liste.forEach((el, index) => {
        const rupture = el.stock <= 0;
        const carte = `
            <div class="col-md-4">
                <div class="card h-100 text-center shadow-sm product-card">
                    <img src="${el.image}" alt="${el.libelle}" class="card-img-top img-fluid p-3">
                    <div class="card-body d-flex flex-column">
                        <span class="badge badge-categorie mb-2 align-self-center">${el.categorie || 'Produit'}</span>
                        <h5 class="card-title">${el.libelle}</h5>
                        <p class="fw-bold prix"><span class="text-warning">PRIX :</span> ${Number(el.prix).toLocaleString('fr-FR')} FCFA</p>
                        <button class="btn btn-gold mt-auto" ${rupture ? 'disabled' : ''} onclick="ajouterPanier(${produits.indexOf(el)})">
                            ${rupture ? 'Rupture de stock' : 'Ajouter au panier'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        zoneProduits.insertAdjacentHTML('beforeend', carte);
    });
}
affichageProduits(produits);

const recherche = document.getElementById("recherche");
recherche.addEventListener('input', (event) => {
    const textSaisi = event.target.value.toLowerCase();
    const produitsFilter = produits.filter(produit =>
        produit.libelle.toLowerCase().includes(textSaisi)
    );
    affichageProduits(produitsFilter);
});

/* ---------- Panier ---------- */

function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}

function ajouterPanier(index) {
    const produit = produits[index];
    const ligne = panier.find(l => l.libelle == produit.libelle);
    const quantiteActuelle = ligne ? ligne.quantite : 0;

    if (quantiteActuelle + 1 > produit.stock) {
        alert("Stock insuffisant pour \"" + produit.libelle + "\".");
        return;
    }

    if (ligne) {
        ligne.quantite++;
    } else {
        panier.push({
            libelle: produit.libelle,
            image: produit.image,
            prix: produit.prix,
            quantite: 1
        });
    }

    sauvegarderPanier();
    afficherPanier();
}

function changerQuantite(index, delta) {
    const ligne = panier[index];
    const produit = produits.find(p => p.libelle == ligne.libelle);

    if (delta > 0 && produit && ligne.quantite + 1 > produit.stock) {
        alert("Stock insuffisant pour \"" + ligne.libelle + "\".");
        return;
    }

    ligne.quantite += delta;
    if (ligne.quantite <= 0) {
        panier.splice(index, 1);
    }

    sauvegarderPanier();
    afficherPanier();
}

function retirerDuPanier(index) {
    panier.splice(index, 1);
    sauvegarderPanier();
    afficherPanier();
}

function totalPanier() {
    return panier.reduce((total, l) => total + l.prix * l.quantite, 0);
}

function afficherPanier() {
    const compteur = document.getElementById('panierCompteur');
    const nbArticles = panier.reduce((n, l) => n + l.quantite, 0);
    compteur.textContent = nbArticles;
    compteur.style.display = nbArticles > 0 ? 'inline-block' : 'none';

    const contenu = document.getElementById('panierContenu');
    const vide = document.getElementById('panierVide');
    const pied = document.getElementById('panierPied');

    if (panier.length == 0) {
        contenu.innerHTML = '';
        vide.style.display = 'block';
        pied.style.display = 'none';
        return;
    }

    vide.style.display = 'none';
    pied.style.display = 'block';

    contenu.innerHTML = '';
    panier.forEach((l, index) => {
        contenu.innerHTML += `
            <div class="panier-item d-flex align-items-center gap-2">
                <img src="${l.image}" alt="${l.libelle}">
                <div class="flex-grow-1">
                    <div class="fw-semibold">${l.libelle}</div>
                    <small class="text-muted">${Number(l.prix).toLocaleString('fr-FR')} FCFA</small>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <button class="btn btn-sm btn-outline-secondary qte-btn" onclick="changerQuantite(${index}, -1)">-</button>
                        <span>${l.quantite}</span>
                        <button class="btn btn-sm btn-outline-secondary qte-btn" onclick="changerQuantite(${index}, 1)">+</button>
                        <button class="btn btn-sm btn-link text-danger ms-auto" onclick="retirerDuPanier(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('panierTotal').textContent = totalPanier().toLocaleString('fr-FR') + " FCFA";
}
afficherPanier();

/* ---------- Commande -> création du colis ---------- */

function ouvrirCommande() {
    if (panier.length == 0) return;

    let recap = '';
    panier.forEach(l => {
        recap += `<div class="d-flex justify-content-between small"><span>${l.quantite} x ${l.libelle}</span><span>${(l.prix * l.quantite).toLocaleString('fr-FR')} FCFA</span></div>`;
    });
    recap += `<div class="d-flex justify-content-between fw-bold mt-2 pt-2 border-top"><span>Total</span><span>${totalPanier().toLocaleString('fr-FR')} FCFA</span></div>`;
    document.getElementById('achatRecap').innerHTML = recap;

    document.getElementById('achatClient').value = "";
    document.getElementById('achatTelephone').value = "";
    document.getElementById('achatAdresse').value = "";
    document.getElementById('achatConfirmation').style.display = 'none';
    document.getElementById('achatFormulaire').style.display = 'block';

    const modal = new bootstrap.Modal(document.getElementById('modalAchat'));
    modal.show();
}

function genererNumeroColis() {
    const annee = new Date().getFullYear();
    return "COL-" + annee + "-" + Math.floor(1000 + Math.random() * 9000);
}

function dateHeureActuelle() {
    let d = new Date();
    return d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 8);
}

function confirmerAchat() {
    const client = document.getElementById('achatClient').value.trim();
    const telephone = document.getElementById('achatTelephone').value.trim();
    const adresse = document.getElementById('achatAdresse').value.trim();

    if (client == "" || telephone == "") {
        alert("Le nom et le téléphone sont obligatoires !");
        return;
    }

    const numero = genererNumeroColis();
    const description = panier.map(l => l.quantite + " x " + l.libelle).join(", ")
        + (adresse ? " — Livraison : " + adresse : "");

    const nouveauColis = {
        numero: numero,
        client: client,
        telephone: telephone,
        description: description,
        statut: "Enregistré",
        historique: [{ statut: "Enregistré", date: dateHeureActuelle() }]
    };

    colis = JSON.parse(localStorage.getItem('listeColis')) || [];
    colis.push(nouveauColis);
    localStorage.setItem('listeColis', JSON.stringify(colis));

    produits = chargerProduits();
    panier.forEach(l => {
        const produit = produits.find(p => p.libelle == l.libelle);
        if (produit) produit.stock = Math.max(0, produit.stock - l.quantite);
    });
    localStorage.setItem('produits', JSON.stringify(produits));
    affichageProduits(produits);

    panier = [];
    sauvegarderPanier();
    afficherPanier();

    document.getElementById('achatFormulaire').style.display = 'none';
    document.getElementById('achatConfirmation').style.display = 'block';
    document.getElementById('numeroColisGenere').textContent = numero;
    document.getElementById('lienSuivi').href = "suivi.html?numero=" + numero;
}