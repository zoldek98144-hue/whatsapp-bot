const express = require('express');
const app = express();
app.get('/', (req,res)=>res.send('GLITSH BOT 24H ONLINE 👑'));
app.listen(3000, ()=>console.log('Web online'));

require('dns').setDefaultResultOrder('ipv4first');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const NUMBER = '249909454277';
const NAME = 'GLITSH';
function fancy(t){return `╭─━━━━━━━━━━━━─╮\n 👑 ${NAME} ✨\n╰─━━━━━━━━━━━━─╯\n\n${t}\n\n> ✨ 𝑮𝑳𝑰𝑻𝑺𝑯 𝑩𝑶𝑻 ✨`;}

async function start(){
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), printQRInTerminal:false, browser:[NAME,'Chrome','1.0'], keepAliveIntervalMs:10000, markOnlineOnConnect:true });
  sock.ev.on('creds.update', saveCreds);
  if(!sock.authState.creds.registered){ await new Promise(r=>setTimeout(r,3000)); try{ console.log('كود الربط:', await sock.requestPairingCode(NUMBER)); }catch(e){ console.log(e.message); } }
  sock.ev.on('connection.update', ({connection, lastDisconnect})=>{
    if(connection==='open'){ console.log(NAME+' متصل 24H'); setInterval(()=>{ try{sock.sendPresenceUpdate('available')}catch{} }, 15*60*1000); }
    if(connection==='close' && lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut) setTimeout(start,5000);
  });
  sock.ev.on('messages.upsert', async ({messages})=>{
    const m=messages[0]; if(!m.message||!m.key.fromMe) return;
    const jid=m.key.remoteJid; let text=(m.message.conversation||m.message.extendedTextMessage?.text||'').trim(); if(!text) return;
    if(text.startsWith('#')) text=text.slice(1).trim();
    const [raw,...args]=text.split(/\s+/); const cmd=raw.toLowerCase();
    const reply=t=>sock.sendMessage(jid,{text:fancy(t)},{quoted:m});
    const isGroup=jid.endsWith('@g.us'); const mentioned=m.message.extendedTextMessage?.contextInfo?.mentionedJid||[];
    try{
      if(['قائمة','قائمه','الاوامر','menu','help'].includes(cmd)){ await reply(`🤖 قـائـمـة الأوامـر 🤖\n\n• صورة +رقم\n• صورة_انمي ناروتو بروفايل\n• صورة_انمي ناروتو خلفية\n\n👑 القروب 👑\n• كشف_بوتات\n• طرد @\n• ترقية @\n• تنزيل @\n• قفل\n• فتح\n\n✨ بدون # شغال ✨`); }
      else if(cmd==='صورة'){ const num=args.join('').replace(/\D/g,''); const [r]=await sock.onWhatsApp(num); let bio='غير متاح'; try{ const s=await sock.fetchStatus(r.jid); const st=Array.isArray(s)?s[0]?.status:s; bio=(st?.status||st)??'غير متاح'; }catch{} let url=null; try{ url=await sock.profilePictureUrl(r.jid,'image'); }catch{} if(url) await sock.sendMessage(jid,{image:{url},caption:fancy(`👤 +${num}\n📝 ${bio}`)},{quoted:m}); else await reply(`👤 +${num}\n📝 ${bio}`); }
      else if(isGroup && ['طرد','ترقية','تنزيل'].includes(cmd)){ const map={'طرد':'remove','ترقية':'promote','تنزيل':'demote'}; await sock.groupParticipantsUpdate(jid,mentioned,map[cmd]); await reply(`✅ تم ${cmd}`); }
      else if(isGroup && cmd==='قفل'){ await sock.groupSettingUpdate(jid,'announcement'); await reply('🔒 تم القفل'); }
      else if(isGroup && cmd==='فتح'){ await sock.groupSettingUpdate(jid,'not_announcement'); await reply('🔓 تم الفتح'); }
      else if(cmd==='صورة_انمي'||cmd==='صوره_انمي'){ const type=args[args.length-1]; const isBg=type==='خلفية'; const name=(isBg||type==='بروفايل')?args.slice(0,-1).join(' '):args.join(' '); try{ const q='query($s:String){Media(search:$s,type:ANIME){title{romaji}coverImage{extraLarge}bannerImage}}'; const res=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q,variables:{s:name}})}); const d=await res.json(); const media=d.data?.Media; let url=isBg?media.bannerImage:media.coverImage.extraLarge;
