let produitsDefaut = [
    { image: 'image/P8.png', libelle: 'Casque Audio', categorie: 'Audio', description: '', prix: 20000, stock: 12 },
    { image: 'image/P4.png', libelle: 'ORDI MACKBOOK', categorie: 'Ordinateurs', description: '', prix: 300000, stock: 5 },
    { image: 'image/P6.png', libelle: 'MONTRE CONNECT', categorie: 'Montres', description: '', prix: 130000, stock: 8 },
    { image: 'image/P2.png', libelle: 'BLUETOOTH', categorie: 'Accessoires', description: '', prix: 10000, stock: 20 },
    { image: 'image/P3.png', libelle: 'SOURIS SANS FIL', categorie: 'Accessoires', description: '', prix: 25000, stock: 15 },
    { image: 'image/P9.png', libelle: 'TELEPHONE SAMSUNG S25 ULTRA', categorie: 'Telephones', description: '', prix: 875000, stock: 4 },
    { image: 'image/P10.png', libelle: 'TELEPHONE IPHONE 14 PRO ORANGE', categorie: 'Telephones', description: '', prix: 1100000, stock: 3 },
    { image: 'image/P11.png', libelle: 'TELEPHONE IPHONE 14 PRO NOIR', categorie: 'Telephones', description: '', prix: 1000000, stock: 3 },
    { image: 'image/P12.png', libelle: 'PC GAMER RTX AU COMPLET - MODELE 1', categorie: 'Ordinateurs', description: '', prix: 1200000, stock: 2 },
    { image: 'image/P13.png', libelle: 'PC GAMER RTX AU COMPLET - MODELE 2', categorie: 'Ordinateurs', description: '', prix: 1400000, stock: 2 },
    { image: 'image/P15.png', libelle: 'ORDI HP OMNIBOOK', categorie: 'Ordinateurs', description: '', prix: 525000, stock: 6 },
    { image: 'image/P16.png', libelle: 'ORDI HP ENVY', categorie: 'Ordinateurs', description: '', prix: 632000, stock: 6 }
];

function chargerProduits() {
    const donnees = localStorage.getItem('produits');
    if (donnees === null) {
        localStorage.setItem('produits', JSON.stringify(produitsDefaut));
        return produitsDefaut;
    }
    return JSON.parse(donnees);
}