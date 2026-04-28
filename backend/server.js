const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const path = require('path');
const multer = require('multer');
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend fonctionne avec MongoDB !' });
});
// Ajouter après les autres routes (vers ligne 20-25)
const pointGeographiqueRoutes = require('./pointGeographiqueRoutes');
app.use('/api/points-geographiques', pointGeographiqueRoutes);
// Configuration multer pour l'upload des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Créer le dossier uploads s'il n'existe pas
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


// Importer les routes d'auth
const authRoutes = require('./authRoutes');
const voyageRoutes = require('./voyageRoutes');
// Utiliser les routes
// Servir les images statiquement
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/voyages', voyageRoutes);
// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});