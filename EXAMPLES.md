# 🧪 Exemples de Requêtes API

## Remplace `YOUR_BACKEND_URL` par ton URL Vercel
Exemple : `https://backend-executor-abc123.vercel.app`

---

## 1️⃣ Enregistrer une nouvelle API

### Exemple : API de calcul de salaire

```bash
curl -X POST YOUR_BACKEND_URL/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "functionName": "calculateSalary",
    "description": "Calcule le salaire total avec heures supplémentaires",
    "inputs": [
      {
        "name": "hours_worked",
        "type": "number",
        "description": "Nombre d heures travaillées"
      },
      {
        "name": "hourly_rate",
        "type": "number",
        "description": "Taux horaire"
      }
    ],
    "outputs": [
      {
        "name": "base_salary",
        "type": "number",
        "description": "Salaire de base"
      },
      {
        "name": "overtime",
        "type": "number",
        "description": "Heures supplémentaires"
      },
      {
        "name": "total_salary",
        "type": "number",
        "description": "Salaire total"
      }
    ],
    "generatedCode": "let base_salary = hours_worked * hourly_rate;\n        let overtime = 0;\n        if (hours_worked > 40) {\n            overtime = (hours_worked - 40) * hourly_rate * 1.5;\n        }\n        let total_salary = base_salary + overtime;"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "functionId": "abc123def456",
  "apiUrl": "YOUR_BACKEND_URL/api/execute/abc123def456",
  "message": "API enregistrée avec succès"
}
```

---

## 2️⃣ Exécuter l'API enregistrée

```bash
curl -X POST YOUR_BACKEND_URL/api/execute/abc123def456 \
  -H "Content-Type: application/json" \
  -d '{
    "hours_worked": 45,
    "hourly_rate": 20
  }'
```

**Réponse attendue :**
```json
{
  "status": "success",
  "functionName": "calculateSalary",
  "description": "Calcule le salaire total avec heures supplémentaires",
  "timestamp": "2025-01-04T10:30:00.000Z",
  "inputs": {
    "hours_worked": 45,
    "hourly_rate": 20
  },
  "outputs": {
    "base_salary": 900,
    "overtime": 150,
    "total_salary": 1050
  }
}
```

---

## 3️⃣ Obtenir les infos d'une API

```bash
curl YOUR_BACKEND_URL/api/info/abc123def456
```

**Réponse :**
```json
{
  "functionName": "calculateSalary",
  "description": "Calcule le salaire total",
  "inputs": [...],
  "outputs": [...],
  "createdAt": "2025-01-04T10:00:00.000Z",
  "endpoint": "/api/execute/abc123def456"
}
```

---

## 4️⃣ Lister toutes les APIs

```bash
curl YOUR_BACKEND_URL/api/list
```

**Réponse :**
```json
{
  "apis": [
    {
      "functionId": "abc123def456",
      "functionName": "calculateSalary",
      "description": "Calcule le salaire",
      "createdAt": "2025-01-04T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 5️⃣ Health Check

```bash
curl YOUR_BACKEND_URL/api/health
```

**Réponse :**
```json
{
  "status": "ok",
  "registeredApis": 1,
  "uptime": 3600.5
}
```

---

## 📱 Exemple avec JavaScript (Frontend)

```javascript
// Enregistrer une API
const registerAPI = async () => {
    const response = await fetch('YOUR_BACKEND_URL/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            functionName: 'calculateSalary',
            description: 'Calcule le salaire',
            inputs: [
                { name: 'hours_worked', type: 'number', description: 'Heures' },
                { name: 'hourly_rate', type: 'number', description: 'Taux' }
            ],
            outputs: [
                { name: 'total_salary', type: 'number', description: 'Total' }
            ],
            generatedCode: 'let total_salary = hours_worked * hourly_rate;'
        })
    });
    
    const result = await response.json();
    console.log('API URL:', result.apiUrl);
    return result;
};

// Exécuter l'API
const executeAPI = async (apiUrl) => {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hours_worked: 40,
            hourly_rate: 25
        })
    });
    
    const result = await response.json();
    console.log('Résultat:', result.outputs);
};

// Utilisation
registerAPI().then(data => {
    executeAPI(data.apiUrl);
});
```

---

## 🐍 Exemple avec Python

```python
import requests
import json

# URL du backend
BACKEND_URL = "YOUR_BACKEND_URL"

# Enregistrer une API
def register_api():
    url = f"{BACKEND_URL}/api/register"
    data = {
        "functionName": "calculateSalary",
        "description": "Calcule le salaire",
        "inputs": [
            {"name": "hours_worked", "type": "number", "description": "Heures"},
            {"name": "hourly_rate", "type": "number", "description": "Taux"}
        ],
        "outputs": [
            {"name": "total_salary", "type": "number", "description": "Total"}
        ],
        "generatedCode": "let total_salary = hours_worked * hourly_rate;"
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    print(f"API URL: {result['apiUrl']}")
    return result

# Exécuter l'API
def execute_api(api_url):
    data = {
        "hours_worked": 40,
        "hourly_rate": 25
    }
    
    response = requests.post(api_url, json=data)
    result = response.json()
    print(f"Résultat: {result['outputs']}")
    return result

# Utilisation
api_info = register_api()
execute_api(api_info['apiUrl'])
```

---

## ⚡ Postman Collection

Importe cette collection dans Postman :

```json
{
  "info": {
    "name": "Backend Executor API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register API",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "{{BACKEND_URL}}/api/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"functionName\": \"calculateSalary\",\n  \"description\": \"Calcule le salaire\",\n  \"inputs\": [{\"name\": \"hours\", \"type\": \"number\", \"description\": \"Heures\"}],\n  \"outputs\": [{\"name\": \"salary\", \"type\": \"number\", \"description\": \"Salaire\"}],\n  \"generatedCode\": \"let salary = hours * 15;\"\n}"
        }
      }
    },
    {
      "name": "Execute API",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "{{BACKEND_URL}}/api/execute/{{FUNCTION_ID}}",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"hours\": 40\n}"
        }
      }
    }
  ],
  "variable": [
    {"key": "BACKEND_URL", "value": "YOUR_BACKEND_URL"}
  ]
}
```
