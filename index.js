const express = require('express');
const app = express();
app.get('/', (req,res)=>res.send('GLITSH BOT ONLINE - 24H'));
app.listen(process.env.PORT||3000, ()=>console.log('Server running on port 10000'));

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const NUMBER = '249909454277';

async function start(){
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({ 
    auth: state, 
    logger: pino({ level: 'silent' }), 
    printQRInTerminal:false, 
    browser:['GLITSH','Chrome','1.0'] 
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  if(!sock.authState.creds.registered){
    await new Promise(r=>setTimeout(r,3000));
    try {
      const code = await sock.requestPairingCode(NUMBER);
      console.log('====================');
      console.log('كود الربط: ' + code);
      console.log('====================');
    } catch(e){ console.log('خطأ في تهيئة العميل:', e.message); }
  }
  
  sock.ev.on('connection.update', ({connection, lastDisconnect})=>{
    if(connection==='open') console.log('GLITSH متصل بنجاح 🟢');
    if(connection==='close' && lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut) start();
  });
