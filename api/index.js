const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/player', async (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.status(400).json({ error: 'UID enter karna zaroori hai!' });
    }

    // Updated working Free Fire API list
    const endpoints = [
        `https://ff-api-ind.vercel.app/api/info?uid=${uid}`,
        `https://api.gameskinbo.com/ff-info/get?uid=${uid}`,
        `https://free-fire-api.vercel.app/api/v1/info?uid=${uid}`
    ];

    for (const url of endpoints) {
        try {
            const response = await axios.get(url, { 
                timeout: 7000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                }
            });

            const data = response.data;

            // Check if response has valid player data
            if (data && (data.basicInfo || data.AccountInfo || data.nickname)) {
                return res.json(data);
            }
        } catch (err) {
            // Agar ek API fail ho, toh next try karo
            continue;
        }
    }

    return res.status(500).json({ 
        error: 'Sabh APIs filhal busy hain. Sahi UID daal kar 10 sec baad try karein.' 
    });
});

module.exports = app;