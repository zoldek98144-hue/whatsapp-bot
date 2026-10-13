const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is active'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PHONE_NUMBER = '249909454277';

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1014160912-alpha.html',
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process'
        ],
    }
});

client.on('qr', async (qr) => {
    console.log('📌 حدث QR تم تفعيله، جاري طلب كود الربط...');
    try {
        const pairingCode = await client.requestPairingCode(PHONE_NUMBER);
        console.log('====================================');
        console.log(`📌 كود الربط الخاص بك هو: ${pairingCode}`);
        console.log('====================================');
    } catch (err) {
        console.error('❌ خطأ تفصيلي أثناء طلب كود الربط:', err);
    }
});

client.on('auth_failure', msg => {
    console.error('❌ فشل المصادقة:', msg);
});

client.on('ready', () => {
    console.log('✅ تم ربط البوت بنجاح تام!');
});

client.initialize().catch(err => {
    console.error('❌ خطأ في تهيئة العميل:', err);
});
