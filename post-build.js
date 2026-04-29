const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'transporteur-app');
const browserPath = path.join(distPath, 'browser');

console.log('🔧 Post-build: Vérification du dossier browser...');

if (fs.existsSync(browserPath)) {
  console.log('📁 Dossier browser trouvé, déplacement des fichiers...');
  const files = fs.readdirSync(browserPath);
  
  for (const file of files) {
    const srcPath = path.join(browserPath, file);
    const destPath = path.join(distPath, file);
    fs.renameSync(srcPath, destPath);
    console.log(`  → Déplacé: ${file}`);
  }
  
  fs.rmdirSync(browserPath);
  console.log('✅ Dossier browser supprimé avec succès !');
} else {
  console.log('✅ Aucun dossier browser trouvé, build OK.');
}