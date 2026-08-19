const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/player', async (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.status(400).json({ error: 'Please enter a valid UID!' });
    }

    // Direct active Free Fire endpoints
    const endpoints = [
        `https://free-fire-api.vercel.app/api/v1/info?uid=${encodeURIComponent(uid)}`,
        `https://ff-api-ind.vercel.app/api/info?uid=${encodeURIComponent(uid)}`
    ];

    const customHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
    };

    for (const url of endpoints) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: customHeaders,
                timeout: 8000
            });

            if (!response.ok) continue;

            const data = await response.json();

            // Extract basic player information correctly
            if (data && (data.basicInfo || data.AccountInfo || data.nickname)) {
                return res.json(data);
            }
        } catch (err) {
            continue;
        }
    }

    return res.status(500).json({
        error: 'UID Invalid hai ya player server par nahi mila. Sahi UID daal kar re-try karein!'
    });
});

module.exports = app;