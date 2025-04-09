// Importer le framework Express
const express = require('express');

// Créer une application Express
const app = express();

// Définir le port d'écoute. Render.com fournira une variable PORT.
// Sinon, on utilise le port 3000 pour le développement local.
const PORT = process.env.PORT || 3000;

// Middleware pour lire le JSON envoyé dans les requêtes POST/PUT
// C'est crucial pour que notre serveur comprenne les données envoyées par Device 1.
app.use(express.json());

// Middleware pour servir les fichiers statiques (HTML, CSS, JS)
// depuis le dossier 'public'. C'est là que sera notre carte Leaflet.
app.use(express.static('public'));

// Variable pour stocker les dernières coordonnées reçues (stockage en mémoire simple)
// Pour commencer, on met des coordonnées par défaut (par exemple, Antananarivo)
let latestCoordinates = { latitude: -18.8792, longitude: 47.5079 };

// === Endpoint pour RECEVOIR les coordonnées (depuis Device 1) ===
// Accepte les requêtes POST sur l'URL '/api/location'
app.post('/api/location', (req, res) => {
  // Récupérer latitude et longitude depuis le corps de la requête JSON
  const { latitude, longitude } = req.body;

  // Validation simple : vérifier si on a bien reçu des nombres
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    // Mettre à jour les coordonnées stockées sur le serveur
    latestCoordinates = { latitude, longitude };
    console.log('Coordonnées reçues et mises à jour :', latestCoordinates);
    // Répondre à Device 1 que tout s'est bien passé (statut 200 OK)
    res.status(200).json({ message: 'Coordonnées reçues avec succès.' });
  } else {
    // Si les données ne sont pas valides, répondre avec une erreur (statut 400 Bad Request)
    console.log('Données invalides reçues:', req.body);
    res.status(400).json({ message: 'Données invalides. Latitude et longitude sont requises et doivent être des nombres.' });
  }
});

// === Endpoint pour FOURNIR les coordonnées (au Visualisateur Device 2) ===
// Accepte les requêtes GET sur l'URL '/api/location'
app.get('/api/location', (req, res) => {
  // Renvoyer les dernières coordonnées stockées au format JSON
  res.status(200).json(latestCoordinates);
});

// Démarrer le serveur et écouter sur le port défini
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 
