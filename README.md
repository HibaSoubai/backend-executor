# 🚀 Backend Executor API

Backend centralisé pour stocker et exécuter les APIs générées par BackendForge.

## 📦 Installation

```bash
npm install
```

## 🎯 Démarrage

```bash
# Développement
npm run dev

# Production
npm start
```

## 🌐 Déploiement

### Option 1 : Vercel (Recommandé - GRATUIT)

1. Va sur [vercel.com](https://vercel.com)
2. Connecte ton compte GitHub
3. Importe ce projet
4. Vercel déploie automatiquement
5. Tu obtiens une URL comme : `https://backend-executor.vercel.app`

### Option 2 : Railway (GRATUIT)

1. Va sur [railway.app](https://railway.app)
2. Clique sur "New Project"
3. Déploie depuis GitHub
4. URL générée automatiquement

### Option 3 : Render (GRATUIT)

1. Va sur [render.com](https://render.com)
2. Crée un nouveau "Web Service"
3. Connecte ce repo
4. Déploie !

## 📡 Endpoints

### 1. Enregistrer une API
```bash
POST /api/register
Content-Type: application/json

{
  "functionName": "calculateSalary",
  "description": "Calcule le salaire",
  "inputs": [
    { "name": "hours", "type": "number", "description": "Heures travaillées" }
  ],
  "outputs": [
    { "name": "salary", "type": "number", "description": "Salaire total" }
  ],
  "generatedCode": "let salary = hours * 15;"
}
```

**Réponse :**
```json
{
  "success": true,
  "functionId": "a1b2c3d4e5f6g7h8",
  "apiUrl": "https://ton-backend.com/api/execute/a1b2c3d4e5f6g7h8"
}
```

### 2. Exécuter une API
```bash
POST /api/execute/{functionId}
Content-Type: application/json

{
  "hours": 160
}
```

**Réponse :**
```json
{
  "status": "success",
  "functionName": "calculateSalary",
  "timestamp": "2025-01-04T10:30:00.000Z",
  "inputs": { "hours": 160 },
  "outputs": { "salary": 2400 }
}
```

### 3. Infos d'une API
```bash
GET /api/info/{functionId}
```

### 4. Lister toutes les APIs
```bash
GET /api/list
```

### 5. Health Check
```bash
GET /api/health
```

## 🔧 Configuration Frontend

Modifie ton HTML pour envoyer le code au backend :

```javascript
// Après la génération du code
const response = await fetch('https://ton-backend.com/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        functionName: generatedAPI.name,
        description: generatedAPI.description,
        inputs: generatedAPI.inputs,
        outputs: generatedAPI.outputs,
        generatedCode: generatedAPI.generatedCode
    })
});

const result = await response.json();
console.log('URL de ton API:', result.apiUrl);
```

## ⚠️ Notes

- **Stockage en mémoire** : Les APIs sont perdues au redémarrage du serveur
- **Production** : Utilise MongoDB/PostgreSQL pour persister les données
- **Sécurité** : Ajoute de l'authentification pour la production

## 📝 TODO (Améliorations futures)

- [ ] Ajouter MongoDB pour persister les données
- [ ] Authentification (API keys)
- [ ] Rate limiting
- [ ] Analytics (nombre d'appels par API)
- [ ] Versioning des APIs
- [ ] TTL (expiration des APIs)
