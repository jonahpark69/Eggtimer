# 🥚 Egg Timer

**Egg Timer** est une application desktop en style **pixel art** développée avec **Electron**, HTML, CSS et JavaScript.  
Elle permet de choisir différents types de cuisson d’œufs, avec des animations, musiques dédiées, et un minuteur personnalisable.

---

## ✨ Fonctionnalités

### 🎛️ Interface et navigation
- **Page d’accueil** : écran d’introduction avec bouton Start.
- **Page menu** : choix du type de cuisson (`À la coque`, `Mollet`, `Au plat`, `Dur`) via de grandes icônes pixel art.
- **Page timer** : animation dédiée au type choisi, affichage du compte à rebours, contrôles pause/reset, modale de durée personnalisée.
- **Page fin** : animation et message lorsque l’œuf est prêt, options Snooze ou Retour au menu.
- **Flèche de retour** dans le header :
  - visible uniquement en page Timer et page Fin
  - renvoie vers le menu des cuissons
  - stoppe le timer et la musique
  - joue un son de clic identique aux boutons fermer/réduire

### ⏱️ Minuteur intelligent
- Durées par défaut pour chaque type de cuisson :
  - À la coque : 3 min 30 (210s)
  - Mollet : 5 min (300s)
  - Au plat : 4 min (240s)
  - Dur : 7 min (420s)
- **Personnalisation des durées** :
  - clic sur le minuteur → modale de réglage (minutes / secondes)
  - sauvegarde automatique par type dans `localStorage`
  - restauration automatique au lancement

### 🎵 Expérience audio
- Sons de clic sur les boutons
- Musique de cuisson spécifique à chaque type (boucle)
- Alarme douce à la fin du timer
- Snooze : relance un timer de 2 minutes avec nouvelle alarme

### 🎨 Design & style
- Pixel art rétro avec couleurs personnalisées
- Animations GIF spécifiques à chaque type de cuisson
- Icônes et éléments d’interface sur mesure
- Police **VT323** pour un rendu rétro

---

## 📂 Structure du projet

assets/
img/ → Images de fond, icônes d’œufs cuits
gifs/ → Animations pixel art des œufs en cuisson
svg/ → Icônes UI (flèche, fermer, réduire, etc.)
sounds/ → Musiques de cuisson et effets sonores
src/
index.html → Structure HTML des pages
style.css → Styles principaux (pixel art + layout)
renderer.js → Logique de l’application (Electron côté front)
main.js → Point d’entrée Electron
package.json → Config du projet et dépendances


---

## 🚀 Installation & exécution

### Prérequis
- [Node.js](https://nodejs.org/) installé sur votre machine
- [Electron](https://www.electronjs.org/) installé globalement ou via `npm install`

### Lancement en développement
```bash
# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm start

Création d’un exécutable
Pour macOS :

npm run package-mac
Pour Windows (depuis macOS, nécessite Wine) :

brew install --cask wine-stable
npm run package-win

⚙️ Technologies utilisées
Electron : création d’application desktop multi-plateforme

HTML5 / CSS3 : structure et style de l’interface

JavaScript : logique de l’application

localStorage : sauvegarde des durées personnalisées

Pixel art : design rétro cohérent sur toute l’application

🔊 Crédits audio
Sons de clic : Mixkit

Musiques de cuisson : compositions personnelles / libres de droit

Alarme : son doux pour signaler la fin de cuisson
