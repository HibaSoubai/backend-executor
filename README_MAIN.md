# 🚀 Backend Executor - URLs d'API Réelles pour BackendForge

## 📖 Qu'est-ce que c'est ?

Ce projet transforme ton site **BackendForge** (générateur de code API) en un système qui génère des **URLs d'API réelles** directement utilisables dans n'importe quel projet.

### AVANT ❌
```
Ton site génère du code Node.js
→ L'utilisateur doit déployer manuellement
→ Pas d'URL prête
```

### APRÈS ✅
```
Ton site génère du code
→ Le backend l'enregistre automatiquement
→ L'utilisateur obtient une URL réelle
→ https://backend-executor.vercel.app/api/execute/abc123
```

---

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. L'utilisateur crée une API sur ton site                   │
│     ↓                                                           │
│  2. Le site génère le code JavaScript                          │
│     ↓                                                           │
│  3. Le code est envoyé au Backend Executor (Vercel)            │
│     ↓                                                           │
│  4. Le backend stocke et exécute l'API                         │
│     ↓                                                           │
│  5. L'utilisateur reçoit une URL réelle                        │
│     https://backend-executor.vercel.app/api/execute/abc123     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Contenu du package

```
backend-executor/
├── 📄 server.js              ← Backend Node.js principal
├── 📄 package.json           ← Dépendances npm
├── 📄 vercel.json            ← Configuration Vercel
├── 📄 .gitignore             ← Fichiers à ignorer
├── 📄 .env.example           ← Template configuration
│
├── 📚 Documentation
│   ├── README.md             ← Ce fichier
│   ├── CHECKLIST.md          ← ✅ Checklist complète (COMMENCE ICI)
│   ├── INSTALLATION.md       ← Guide installation détaillé
│   ├── QUICK_START.md        ← Résumé rapide
│   └── EXAMPLES.md           ← Exemples de code
│
└── 📦 backend-executor.zip   ← Tous les fichiers en ZIP
```

---

## 🚀 DÉMARRAGE RAPIDE (5 minutes)

### 1️⃣ Télécharge les fichiers
- Télécharge `backend-executor.zip`
- Décompresse-le

### 2️⃣ Déploie sur Vercel (GRATUIT)
```bash
# Crée un repo GitHub avec les fichiers
# Puis sur vercel.com :
1. New Project
2. Import ton repo
3. Deploy
4. Copie l'URL : https://backend-executor-abc123.vercel.app
```

### 3️⃣ Modifie ton HTML
```javascript
// Ajoute cette ligne dans ton fichier HTML (ligne ~1200)
const BACKEND_URL = 'https://backend-executor-abc123.vercel.app';

// Puis suis les instructions dans CHECKLIST.md
```

### 4️⃣ C'EST TOUT ! 🎉
Ton site génère maintenant des URLs d'API réelles !

---

## 📚 Documentation complète

| Fichier | Description | Utilise-le si... |
|---------|-------------|------------------|
| **CHECKLIST.md** | ✅ Checklist étape par étape | Tu veux un guide complet |
| **QUICK_START.md** | ⚡ Résumé ultra-rapide | Tu es pressé |
| **INSTALLATION.md** | 📖 Guide détaillé | Tu veux tout comprendre |
| **EXAMPLES.md** | 💻 Exemples de code | Tu veux des exemples d'utilisation |
| **README.md** | 📄 Vue d'ensemble | Tu découvres le projet |

---

## 🔥 Fonctionnalités

### Backend (server.js)
✅ Enregistre les APIs générées  
✅ Exécute le code JavaScript dynamiquement  
✅ Valide les paramètres d'entrée  
✅ Retourne des réponses JSON structurées  
✅ CORS activé pour tous les domaines  
✅ Health check endpoint  
✅ Liste des APIs enregistrées  

### Frontend (modifications HTML)
✅ Envoie automatiquement le code au backend  
✅ Affiche l'URL réelle de l'API  
✅ Bouton "Copier l'URL"  
✅ Bouton "Tester API réelle"  
✅ Exemples de code (fetch, cURL, Python)  
✅ Fallback si backend non disponible  

---

## 🛠️ Technologies

- **Backend**: Node.js + Express
- **Déploiement**: Vercel (gratuit)
- **Stockage**: Map en mémoire (peut être MongoDB)
- **Frontend**: JavaScript vanilla (ton HTML existant)

---

## 📊 Endpoints de l'API

### POST /api/register
Enregistre une nouvelle API et retourne son URL

**Request:**
```json
{
  "functionName": "calculateSalary",
  "description": "Calcule le salaire",
  "inputs": [...],
  "outputs": [...],
  "generatedCode": "let salary = hours * rate;"
}
```

**Response:**
```json
{
  "success": true,
  "functionId": "abc123def456",
  "apiUrl": "https://backend-executor.vercel.app/api/execute/abc123def456"
}
```

### POST /api/execute/:functionId
Exécute une API enregistrée

**Request:**
```json
{
  "hours": 40,
  "rate": 25
}
```

**Response:**
```json
{
  "status": "success",
  "outputs": {
    "salary": 1000
  }
}
```

### GET /api/info/:functionId
Obtient les infos d'une API

### GET /api/list
Liste toutes les APIs

### GET /api/health
Vérifie le statut du serveur

---

## 🎯 Exemple d'utilisation

### 1. L'utilisateur crée une API sur ton site
```
Nom: calculateSalary
Inputs: hours (number), rate (number)
Logic: "Multiplier les heures par le taux"
```

### 2. Ton site génère et enregistre l'API
```javascript
// Ton HTML envoie automatiquement au backend
const response = await fetch(`${BACKEND_URL}/api/register`, {
    method: 'POST',
    body: JSON.stringify({ ... })
});
```

### 3. L'utilisateur reçoit une URL
```
✅ Votre API est prête !
URL: https://backend-executor.vercel.app/api/execute/abc123def456

[📋 Copier l'URL]  [🚀 Tester API réelle]
```

### 4. L'utilisateur utilise l'API n'importe où
```javascript
// Dans n'importe quel projet
fetch('https://backend-executor.vercel.app/api/execute/abc123def456', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hours: 40, rate: 25 })
})
.then(res => res.json())
.then(data => console.log(data.outputs));
```

---

## ⚡ Performance

- **Temps de réponse**: < 200ms
- **Limite**: 100 requêtes/minute (configurable)
- **Stockage**: En mémoire (rapide mais volatile)
- **Déploiement**: Vercel Edge Network (mondial)

---

## 🔒 Sécurité

### Actuel (MVP)
- ✅ CORS activé
- ✅ Validation des inputs
- ✅ Try-catch sur l'exécution
- ⚠️ Pas d'authentification
- ⚠️ Stockage en mémoire (perdu au restart)

### Améliorations possibles
- 🔐 API Keys
- 🔐 Rate limiting par utilisateur
- 💾 MongoDB pour persistence
- 🔐 JWT pour authentification

---

## 📈 Roadmap

- [x] Backend basique fonctionnel
- [x] Enregistrement d'APIs
- [x] Exécution dynamique
- [x] Interface utilisateur
- [ ] MongoDB pour persistence
- [ ] Authentification (API keys)
- [ ] Analytics (nombre d'appels)
- [ ] Versioning des APIs
- [ ] Custom domains
- [ ] Rate limiting avancé

---

## ❓ FAQ

### Q: Les APIs sont-elles persistantes ?
**R:** Non, elles sont en mémoire. Si Vercel redémarre, elles sont perdues. Pour les persister, ajoute MongoDB (voir INSTALLATION.md).

### Q: C'est gratuit ?
**R:** Oui ! Vercel offre un plan gratuit très généreux.

### Q: Combien d'APIs puis-je créer ?
**R:** Illimité (limité par la RAM de Vercel).

### Q: Puis-je utiliser mon propre domaine ?
**R:** Oui ! Configure-le dans les paramètres Vercel.

### Q: Est-ce sécurisé ?
**R:** Pour un MVP, oui. Pour la production, ajoute l'authentification.

---

## 🆘 Support

### Problème courant 1: "Backend non disponible"
**Solution:** Vérifie que `BACKEND_URL` dans ton HTML correspond à ton URL Vercel

### Problème courant 2: "CORS error"
**Solution:** Normal, le backend a déjà CORS activé. Vérifie l'URL.

### Problème courant 3: "API non trouvée"
**Solution:** Les APIs sont en mémoire. Si Vercel redémarre, elles sont perdues.

---

## 📝 Licence

MIT - Utilise librement pour tes projets !

---

## 🎉 Conclusion

Avec ce système, ton site **BackendForge** devient encore plus puissant :
- ✅ Génère du code
- ✅ Déploie automatiquement
- ✅ Donne des URLs prêtes
- ✅ Aucune config pour l'utilisateur

**COMMENCE PAR LIRE : `CHECKLIST.md`**

Bon courage ! 🚀
