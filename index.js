const { Client, LocalAuth } = require('whatsapp-web.js');

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
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
    }
});

client.on('qr', async (qr) => {
    try {
        const pairingCode = await client.requestPairingCode(PHONE_NUMBER);
        console.log('====================================');
        console.log(`📌 كود الربط الخاص بك هو: ${pairingCode}`);
        console.log('====================================');
    } catch (err) {
        console.error('❌ خطأ في طلب الكود:', err);
    }
});

client.on('ready', () => {
    console.log('✅ تم الاتصال بنجاح!');
});

client.initialize();
