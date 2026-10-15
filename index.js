const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send(`
    <html dir="rtl" style="background:#111;color:#fff;font-family:sans-serif;text-align:center;padding:50px">
      <h1 style="font-size:40px">GLITSH 🤖</h1>
      <h2 style="color:#0f0">البوت شغال ومتصل ✅</h2>
      <p>السيرفر شغال على Render</p>
      <hr>
      <p>الخطوة الجاية حنضيف كود الربط بتاع الواتساب</p>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GLITSH Live on ${PORT}`);
});
