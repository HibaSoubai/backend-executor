# 🚀 Guide d'Installation Complet

## 📋 Ce qu'on va faire

1. ✅ Déployer le backend sur Vercel (GRATUIT)
2. ✅ Modifier ton HTML pour utiliser le backend
3. ✅ Obtenir des URLs d'API réelles !

---

## 🎯 ÉTAPE 1 : Déployer le Backend (5 minutes)

### Option A : Vercel (Recommandé - Le plus simple)

1. **Crée un compte sur Vercel**
   - Va sur [vercel.com](https://vercel.com)
   - Connecte-toi avec GitHub

2. **Créé un repo GitHub**
   - Va sur [github.com/new](https://github.com/new)
   - Nom du repo : `backend-executor`
   - Public ou Private (peu importe)
   - Crée le repo

3. **Upload les fichiers du backend**
   - Dans ton repo GitHub, clique sur "Add file" > "Upload files"
   - Upload ces 2 fichiers :
     * `server.js`
     * `package.json`
   - Commit les fichiers

4. **Déploie sur Vercel**
   - Sur Vercel, clique "New Project"
   - Import ton repo `backend-executor`
   - Vercel détecte automatiquement que c'est du Node.js
   - Clique "Deploy"
   - ⏳ Attends 2-3 minutes

5. **Récupère l'URL**
   - Une fois déployé, Vercel te donne une URL comme :
     ```
     https://backend-executor-abc123.vercel.app
     ```
   - ✅ COPIE CETTE URL, on en aura besoin !

---

### Option B : Railway (Alternative gratuite)

1. Va sur [railway.app](https://railway.app)
2. Clique "New Project"
3. "Deploy from GitHub repo"
4. Sélectionne ton repo
5. Railway déploie automatiquement
6. Copie l'URL générée

---

## 🔧 ÉTAPE 2 : Modifier ton HTML

### Ouvre ton fichier HTML

Dans la section `<script>`, trouve la ligne 1200 environ (juste après `let generatedAPI = null;`) et ajoute :

```javascript
// 🆕 AJOUTE CETTE LIGNE
const BACKEND_URL = 'https://backend-executor-abc123.vercel.app'; // 👈 Remplace par TON URL Vercel
```

### Remplace la fonction `displayGeneratedCode`

**Cherche cette fonction :**
```javascript
function displayGeneratedCode() {
    const code = `// ${generatedAPI.name}
```

**Remplace-la par :**
```javascript
async function displayGeneratedCode() {
    const code = `// ${generatedAPI.name} - BackendForge AI
// ... le reste du code ...

    document.getElementById('codeContent').textContent = code;
    
    // 🆕 AJOUTE CETTE LIGNE
    await registerAPIOnBackend();
}
```

### Ajoute la nouvelle fonction `registerAPIOnBackend`

**Juste après `displayGeneratedCode()`, ajoute :**

```javascript
// 🆕 NOUVELLE FONCTION
async function registerAPIOnBackend() {
    try {
        showNotification('⏳ Enregistrement de l\'API...', 'info');
        
        const response = await fetch(`${BACKEND_URL}/api/register`, {
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
        
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        
        const result = await response.json();
        
        generatedAPI.realApiUrl = result.apiUrl;
        generatedAPI.functionId = result.functionId;
        
        showNotification('✅ API enregistrée et prête !');
        console.log('URL de ton API:', result.apiUrl);
        
    } catch (error) {
        console.error('❌ Backend error:', error);
        generatedAPI.realApiUrl = null;
        showNotification('⚠️ Backend non disponible', 'warning');
    }
}
```

### Modifie la fonction `getAPIUrl`

**Cherche :**
```javascript
function getAPIUrl() {
    const urlDisplay = document.getElementById('apiUrlDisplay');
```

**Remplace par :**
```javascript
function getAPIUrl() {
    const urlDisplay = document.getElementById('apiUrlDisplay');
    if (urlDisplay.style.display === 'none') {
        urlDisplay.style.display = 'block';
        
        // 🆕 AJOUTE CES LIGNES
        if (generatedAPI.realApiUrl) {
            document.getElementById('realApiUrl').textContent = generatedAPI.realApiUrl;
            document.getElementById('realApiSection').style.display = 'block';
            document.getElementById('deploymentInstructions').style.display = 'none';
        } else {
            document.getElementById('realApiSection').style.display = 'none';
            document.getElementById('deploymentInstructions').style.display = 'block';
        }
        
        document.getElementById('apiEndpoint').textContent = generatedAPI.name;
        urlDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        urlDisplay.style.display = 'none';
    }
}
```

### Ajoute les nouvelles fonctions helper

```javascript
// 🆕 COPIER L'URL RÉELLE
function copyRealApiUrl() {
    if (generatedAPI.realApiUrl) {
        navigator.clipboard.writeText(generatedAPI.realApiUrl);
        showNotification('✅ URL copiée : ' + generatedAPI.realApiUrl);
    }
}

// 🆕 TESTER L'API RÉELLE
async function testRealAPI() {
    if (!generatedAPI.realApiUrl) {
        showNotification('❌ Backend non disponible', 'error');
        return;
    }
    
    const testData = {};
    generatedAPI.inputs.forEach(input => {
        const value = document.getElementById(`test_${input.name}`).value.trim();
        testData[input.name] = input.type === 'number' ? parseFloat(value) : value;
    });
    
    try {
        showNotification('⏳ Test de l\'API réelle...', 'info');
        
        const response = await fetch(generatedAPI.realApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        
        document.getElementById('testResult').style.display = 'block';
        document.getElementById('testResult').innerHTML = `
            <h4 style="color: var(--primary-blue);">✅ Résultat API réelle</h4>
            <div class="code-block"><pre>${JSON.stringify(result, null, 2)}</pre></div>
        `;
        
        showNotification('✅ API testée !');
        
    } catch (error) {
        document.getElementById('testResult').style.display = 'block';
        document.getElementById('testResult').innerHTML = `
            <div style="color: #EF4444; padding: 20px;">
                <h4>❌ Erreur</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}
```

### Modifie le HTML du `apiUrlDisplay`

**Cherche le div `id="apiUrlDisplay"` et remplace tout son contenu par celui du fichier `frontend-modified.html`**

---

## ✅ ÉTAPE 3 : Tester

1. **Ouvre ton HTML modifié dans le navigateur**
2. **Crée une API test** (ex: calculateSalary)
3. **Clique sur "Générer l'API"**
4. **Clique sur "Obtenir l'URL de l'API"**
5. **Tu devrais voir** :
   ```
   ✅ Votre API est prête !
   URL : https://backend-executor-abc123.vercel.app/api/execute/abc123def456
   ```

---

## 🎉 C'EST TOUT !

Maintenant :
- ✅ Ton site génère des APIs
- ✅ Les APIs sont automatiquement déployées
- ✅ Tu obtiens des URLs réelles
- ✅ Tu peux les utiliser dans n'importe quel projet !

---

## 🔍 Vérification rapide

**Teste ton backend :**
```bash
# Remplace par ton URL Vercel
curl https://backend-executor-abc123.vercel.app/api/health
```

**Résultat attendu :**
```json
{
  "status": "ok",
  "registeredApis": 0,
  "uptime": 123.45
}
```

---

## ❓ Problèmes courants

### "Backend non disponible"
- Vérifie que ton backend est bien déployé sur Vercel
- Vérifie que `BACKEND_URL` dans le HTML est correct
- Ouvre la console du navigateur (F12) pour voir les erreurs

### "CORS error"
- Le backend a déjà `cors()` activé
- Si ça persiste, vérifie que l'URL est bien HTTPS

### "API non trouvée"
- L'API est stockée en mémoire (RAM)
- Si Vercel redémarre, les APIs sont perdues
- Pour la production, utilise MongoDB (voir guide avancé)

---

## 🚀 Prochaines étapes (optionnel)

1. **Ajouter MongoDB** pour persister les APIs
2. **Ajouter l'authentification** (API keys)
3. **Analytics** (nombre d'appels)
4. **Custom domains**

Besoin d'aide ? Dis-moi !
