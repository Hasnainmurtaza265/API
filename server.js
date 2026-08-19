const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/api/player', async (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.status(400).json({ error: 'UID required hai!' });
    }

    // List of backup endpoints
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
            // Try next endpoint if current fails
            continue;
        }
    }

    return res.status(500).json({ error: 'APIs filhal respond nahi kar rahi hain. Kuch der baad try karein.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));