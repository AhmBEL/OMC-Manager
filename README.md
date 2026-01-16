# 🍰 OMC Manager - Oh My Cake

Application de gestion des produits et fournisseurs pour Oh My Cake.

## Fonctionnalités

- **Dashboard** : Vue d'ensemble avec KPIs, marges, alertes
- **Catalogue** : Liste des produits avec filtres, tri, recherche
- **Fournisseurs** : Gestion des fournisseurs
- **Paramètres** : Configuration des emballages, transformations, catégories, TVA

## Installation locale

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build
```

## Déploiement sur Vercel

L'application est prête à être déployée sur Vercel en quelques clics.

---

## 📋 Guide de déploiement étape par étape

### Étape 1 : Créer un compte GitHub (si pas déjà fait)

1. Va sur [github.com](https://github.com)
2. Clique sur **Sign up**
3. Suis les instructions pour créer ton compte

### Étape 2 : Créer un nouveau repository sur GitHub

1. Connecte-toi sur GitHub
2. Clique sur le **+** en haut à droite → **New repository**
3. Configure :
   - **Repository name** : `omc-manager`
   - **Description** : `Gestion produits Oh My Cake`
   - **Public** ou **Private** (au choix)
   - ❌ Ne PAS cocher "Add a README file"
4. Clique sur **Create repository**

### Étape 3 : Installer Git sur ton ordinateur

**Windows :**
- Télécharge depuis [git-scm.com](https://git-scm.com/download/win)
- Installe avec les options par défaut

**Mac :**
```bash
# Ouvre Terminal et tape :
xcode-select --install
```

### Étape 4 : Uploader le projet sur GitHub

1. Télécharge et décompresse le projet `omc-manager-app.zip`
2. Ouvre un terminal/invite de commandes dans le dossier du projet
3. Exécute ces commandes :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - OMC Manager"

# Connecter à GitHub (remplace TON_USERNAME par ton nom d'utilisateur)
git remote add origin https://github.com/TON_USERNAME/omc-manager.git

# Envoyer sur GitHub
git branch -M main
git push -u origin main
```

### Étape 5 : Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Clique sur **Sign Up** → **Continue with GitHub**
3. Autorise Vercel à accéder à ton GitHub
4. Clique sur **Add New...** → **Project**
5. Trouve et sélectionne **omc-manager**
6. Vercel détecte automatiquement que c'est un projet Vite
7. Clique sur **Deploy**
8. Attends 1-2 minutes... ✅ C'est en ligne !

Tu recevras une URL du type : `https://omc-manager-xxx.vercel.app`

### Étape 6 : Mises à jour futures

Chaque fois que tu veux mettre à jour l'application :

```bash
# Dans le dossier du projet
git add .
git commit -m "Description de la modification"
git push
```

Vercel redéploie automatiquement ! 🚀

---

## Structure du projet

```
omc-manager-app/
├── index.html          # Page HTML principale
├── package.json        # Dépendances npm
├── vite.config.js      # Configuration Vite
├── tailwind.config.js  # Configuration Tailwind CSS
├── postcss.config.js   # Configuration PostCSS
└── src/
    ├── main.jsx        # Point d'entrée React
    ├── App.jsx         # Application principale
    └── index.css       # Styles CSS
```

## Technologies utilisées

- **React 18** - Interface utilisateur
- **Vite** - Build tool rapide
- **Tailwind CSS** - Styles utilitaires
- **localStorage** - Stockage des données

## Notes

- Les données sont stockées dans le localStorage du navigateur
- Chaque navigateur/appareil a ses propres données
- Pour partager les données entre appareils, une base de données serait nécessaire (évolution future possible)

---

Développé avec ❤️ pour Oh My Cake 🍰
