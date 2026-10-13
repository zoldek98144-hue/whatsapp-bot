const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', (qr) => {
    console.log('📌 امسح رمز الاستجابة السريعة (QR Code) التالي بواسطة تطبيق واتساب:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ تم ربط البوت بنجاح وهو يعمل الآن بكفاءة!');
});

client.on('message', async (msg) => {
    if (msg.body === '.مرحبا' || msg.body === '.اوامر') {
        await msg.reply('أهلاً بك! بوت واتساب يعمل بنجاح على السحابة.');
    }
});

client.initialize();
