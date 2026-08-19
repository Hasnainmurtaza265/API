const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/player', async (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.status(400).json({ error: 'UID required hai!' });
    }

    const endpoints = [
        `https://free-fire-api.vercel.app/api/v1/info?uid=${uid}`,
        `https://ff-api-ind.vercel.app/api/info?uid=${uid}`
    ];

    for (const url of endpoints) {
        try {
            const response = await axios.get(url, { timeout: 5000 });
            if (response.data && (response.data.basicInfo || response.data.AccountInfo)) {
                return res.json(response.data);
            }
        } catch (err) {
            continue;
        }
    }

    return res.status(500).json({ error: 'APIs respond nahi kar rahi hain. Kuch der baad try karein.' });
});

module.exports = app;