const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is active'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PHONE_NUMBER = '249909454277';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
    }
});

client.on('ready', () => {
    console.log('✅ تم ربط البوت بنجاح تام!');
});

client.initialize().then(async () => {
    console.log('🔄 جاري طلب كود الربط برقم الهاتف...');
    try {
        const pairingCode = await client.requestPairingCode(PHONE_NUMBER);
        console.log('====================================');
        console.log(`📌 كود الربط الخاص بك هو: ${pairingCode}`);
        console.log('====================================');
    } cratch (err) {
        console.error('❌ خطأ أثناء طلب كود الربط:', err);
    }
}).catch(err => {
    console.error('❌ خطأ في تهيئة العميل:', err);
});
