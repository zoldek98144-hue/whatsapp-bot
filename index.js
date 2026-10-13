const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
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

client.on('qr', (qr) => {
    console.log('📌 امسح رمز الاستجابة السريعة (QR) أدناه:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ البوت بنجاح وهو يعمل الآن بكفاءة!');
});

client.on('message', async (msg) => {
    if (msg.body === '.مرحبا' || msg.body === 'مرحبا') {
        await msg.reply('أهلاً بك، البوت يعمل بنجاح على السحابة!');
    }
});

client.initialize();
