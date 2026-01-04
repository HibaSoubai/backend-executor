// Backend Executor - Stocke et exécute les APIs générées
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Base de données en mémoire (tu peux remplacer par MongoDB/PostgreSQL)
const apiStore = new Map();

// ===== ENDPOINT 1 : Enregistrer une nouvelle API =====
app.post('/api/register', (req, res) => {
    try {
        const { functionName, description, inputs, outputs, generatedCode } = req.body;

        if (!functionName || !generatedCode) {
            return res.status(400).json({ error: 'functionName et generatedCode requis' });
        }

        // Générer un ID unique
        const functionId = crypto.randomBytes(8).toString('hex');

        // Stocker l'API
        apiStore.set(functionId, {
            functionName,
            description,
            inputs,
            outputs,
            generatedCode,
            createdAt: new Date().toISOString()
        });

        // Retourner l'URL de l'API
        const apiUrl = `${req.protocol}://${req.get('host')}/api/execute/${functionId}`;

        res.json({
            success: true,
            functionId,
            apiUrl,
            message: 'API enregistrée avec succès'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== ENDPOINT 2 : Exécuter une API enregistrée =====
app.post('/api/execute/:functionId', async (req, res) => {
    try {
        const { functionId } = req.params;
        const inputData = req.body;

        // Récupérer l'API
        const apiConfig = apiStore.get(functionId);
        if (!apiConfig) {
            return res.status(404).json({ 
                error: 'API non trouvée',
                functionId 
            });
        }

        // Valider les inputs
        for (const input of apiConfig.inputs) {
            if (inputData[input.name] === undefined) {
                return res.status(400).json({ 
                    error: `Paramètre requis: ${input.name}`,
                    expectedInputs: apiConfig.inputs.map(i => ({
                        name: i.name,
                        type: i.type,
                        description: i.description
                    }))
                });
            }
        }

        // Préparer les variables
        const inputNames = apiConfig.inputs.map(i => i.name);
        const inputValues = inputNames.map(name => inputData[name]);

        // Initialiser les outputs non déclarés
        const outputDeclarations = apiConfig.outputs
            .filter(o => {
                const regex = new RegExp(`let\\s+${o.name}\\b`);
                return !regex.test(apiConfig.generatedCode);
            })
            .map(o => `let ${o.name};`)
            .join('\n');

        // Construire le code complet
        const fullCode = `
            ${outputDeclarations}
            ${apiConfig.generatedCode}
            
            return {
                ${apiConfig.outputs.map(o => `${o.name}: ${o.name}`).join(',\n')}
            };
        `;

        // Exécuter le code
        const func = new Function(...inputNames, fullCode);
        const result = func(...inputValues);

        // Retourner le résultat
        res.json({
            status: 'success',
            functionName: apiConfig.functionName,
            description: apiConfig.description,
            timestamp: new Date().toISOString(),
            inputs: inputData,
            outputs: result
        });

    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// ===== ENDPOINT 3 : Obtenir les infos d'une API =====
app.get('/api/info/:functionId', (req, res) => {
    const { functionId } = req.params;
    const apiConfig = apiStore.get(functionId);

    if (!apiConfig) {
        return res.status(404).json({ error: 'API non trouvée' });
    }

    res.json({
        functionName: apiConfig.functionName,
        description: apiConfig.description,
        inputs: apiConfig.inputs,
        outputs: apiConfig.outputs,
        createdAt: apiConfig.createdAt,
        endpoint: `/api/execute/${functionId}`
    });
});

// ===== ENDPOINT 4 : Lister toutes les APIs =====
app.get('/api/list', (req, res) => {
    const apis = Array.from(apiStore.entries()).map(([id, config]) => ({
        functionId: id,
        functionName: config.functionName,
        description: config.description,
        createdAt: config.createdAt
    }));

    res.json({ apis, count: apis.length });
});

// ===== ENDPOINT 5 : Health check =====
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        registeredApis: apiStore.size,
        uptime: process.uptime()
    });
});

// ===== ENDPOINT 6 : Documentation HTML =====
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Backend Executor API</title>
            <style>
                body { 
                    font-family: 'Inter', sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: #f5f7fa;
                }
                h1 { color: #4A90E2; }
                .endpoint { 
                    background: white; 
                    padding: 20px; 
                    margin: 15px 0; 
                    border-radius: 10px;
                    border-left: 4px solid #4A90E2;
                }
                code { 
                    background: #f0f0f0; 
                    padding: 2px 6px; 
                    border-radius: 4px;
                    font-family: monospace;
                }
                .method { 
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-weight: bold;
                    margin-right: 10px;
                }
                .post { background: #10B981; color: white; }
                .get { background: #3B82F6; color: white; }
            </style>
        </head>
        <body>
            <h1>🚀 Backend Executor API</h1>
            <p>Backend centralisé pour exécuter les APIs générées par BackendForge</p>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/register</code>
                <p>Enregistrer une nouvelle API et obtenir son URL</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/execute/:functionId</code>
                <p>Exécuter une API enregistrée</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/info/:functionId</code>
                <p>Obtenir les informations d'une API</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/list</code>
                <p>Lister toutes les APIs enregistrées (${apiStore.size} APIs)</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/health</code>
                <p>Vérifier le statut du serveur</p>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend Executor démarré sur le port ${PORT}`);
    console.log(`📡 APIs enregistrées: ${apiStore.size}`);
});
