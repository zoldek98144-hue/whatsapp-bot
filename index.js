const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeData = '';

// صفحة الويب التي ستعرض QR Code مباشرة
app.get('/', (req, res) => {
    if (!qrCodeData) {
        return res.send('<h2>البوت جاري إقلاعه أو تم ربطه بالفعل. يرجى تحديث الصفحة بعد قليل...</h2>');
    }
    
    // تحويل نص الـ QR إلى صورة تفاعلية تظهر على المتصفح
    qrcode.toDataURL(qrCodeData, (err, url) => {
        if (err) return res.send('خطأ في توليد صورة الـ QR');
        res.send(`
            <div style="text-align: center; margin-top: 50px;">
                <h2>امسح رمز الاستجابة السريعة (QR Code) لربط الواتساب</h2>
                <img src="${url}" alt="WhatsApp QR Code" style="width: 300px; height: 300px;"/>
                <p>قم بتحديث الصفحة إذا لم يظهر الرمز أو جدد الصفحة بعد المسح.</p>
            </div>
        `);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
    console.log('📌 تم استقبال QR Code جديد، وسيتم عرضه على موقع الويب.');
    qrCodeData = qr;
});

client.on('ready', () => {
    console.log('✅ تم ربط البوت بنجاح تام!');
    qrCodeData = ''; // إخفاء الرمز بعد الاتصال الناجح
});

client.initialize().catch(err => {
    console.error('❌ خطأ في تهيئة العميل:', err);
});
