# 🥚 Egg Timer

**Egg Timer** est une application desktop en **pixel art** construite avec **Electron**, **HTML**, **CSS** et **JavaScript**. Elle permet de choisir différents types de cuisson d’œufs, avec animations dédiées, musique par cuisson, et un minuteur personnalisable.

---

## 📌 Sommaire

* [Fonctionnalités](#-fonctionnalités)

  * [Interface & navigation](#️-interface--navigation)
  * [Minuteur intelligent](#️-minuteur-intelligent)
  * [Expérience audio](#-expérience-audio)
  * [Design & style](#-design--style)
* [Structure du projet](#-structure-du-projet)
* [Installation & exécution](#-installation--exécution)

  * [Prérequis](#prérequis)
  * [Lancement en développement](#lancement-en-développement)
  * [Création d’exécutables](#création-dexécutables)
* [Technologies utilisées](#️-technologies-utilisées)
* [Crédits audio](#-crédits-audio)

---

## ✨ Fonctionnalités

### 🎛️ Interface & navigation

* **Page d’accueil** : écran d’introduction avec bouton *Start*.
* **Page menu** : choix du type de cuisson (`À la coque`, `Mollet`, `Au plat`, `Dur`) via grandes icônes pixel art.
* **Page timer** : animation dédiée au type choisi, affichage du compte à rebours, contrôles *pause*/*reset*, modale de durée personnalisée.
* **Page fin** : animation + message lorsque l’œuf est prêt, options *Snooze* ou *Retour au menu*.
* **Flèche de retour** dans le header :

  * visible uniquement en **page Timer** et **page Fin**
  * renvoie vers le **menu** des cuissons
  * **stoppe** le timer et la musique
  * joue un **son de clic** (identique aux boutons fermer/réduire)

### ⏱️ Minuteur intelligent

* Durées par défaut :

  * **À la coque** : 3 min 30 (210s)
  * **Mollet** : 5 min (300s)
  * **Au plat** : 4 min (240s)
  * **Dur** : 7 min (420s)
* **Personnalisation** des durées :

  * clic sur le minuteur → **modale** (minutes/secondes)
  * sauvegarde **par type** dans `localStorage`
  * **restauration** automatique au lancement

### 🎵 Expérience audio

* **Sons de clic** sur les boutons
* **Musique de cuisson** spécifique à chaque type (en boucle)
* **Alarme douce** à la fin du timer
* **Snooze** : relance un timer de **2 minutes** avec nouvelle alarme

### 🎨 Design & style

* Pixel art **rétro** (couleurs personnalisées)
* **GIFs** d’animation spécifiques à chaque cuisson
* Icônes/éléments d’UI **sur mesure**
* Police **VT323** pour le rendu rétro

---

## 📂 Structure du projet

```
assets/
  img/      # images de fond, icônes d’œufs
  gifs/     # animations pixel art des cuissons
  svg/      # icônes UI (flèche, fermer, réduire…)
  sounds/   # musiques de cuisson + effets
src/
  index.html   # structure HTML des pages
  style.css    # styles principaux (pixel art + layout)
  renderer.js  # logique front (processus renderer)
main.js        # point d’entrée Electron (processus main)
package.json   # config du projet + scripts
README.md
```

> *Note : si tu préfères éviter `src/`, tu peux garder les fichiers à la racine — la logique reste identique.*

---

## 🚀 Installation & exécution

### Prérequis

* **Node.js** installé
* **npm** (inclus avec Node)
* **Electron** sera installé **en dépendance** du projet (pas besoin global)

### Lancement en développement

```bash
# Installer les dépendances
npm install

# Lancer l’application (dev)
npm start
```

### Création d’exécutables

> Requiert une configuration de packaging (ex. **electron-builder**) dans `package.json`. Exemple minimal :

```json
{
  "name": "eggtimer",
  "version": "0.1.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "package:mac": "electron-builder --mac",
    "package:win": "electron-builder --win"
  },
  "devDependencies": {
    "electron": "^32.0.0",
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.yourname.eggtimer",
    "mac": { "category": "public.app-category.utilities" },
    "win": { "target": "nsis" }
  }
}
```

Ensuite :

```bash
# macOS
npm run package:mac

# Windows (depuis Windows de préférence)
npm run package:win
```

> Sur macOS pour packager Windows, il faut des outils supplémentaires (Wine/Mono) — plus simple de builder **sur** Windows.

---

## ⚙️ Technologies utilisées

* **Electron** : application desktop multi‑plateforme
* **HTML5 / CSS3** : interface et styles pixel art
* **JavaScript** : logique de l’application
* **localStorage** : sauvegarde des durées personnalisées
* **Pixel art** : design rétro homogène

---

## 🔊 Crédits audio

* **Sons de clic** : Mixkit
* **Musiques de cuisson** : compositions personnelles / libres de droit
* **Alarme** : son doux de fin de cuisson


