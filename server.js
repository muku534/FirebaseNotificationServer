const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());

app.post('/send-notification', async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).send('Token, title, and body are required');
    }

    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending notification');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
