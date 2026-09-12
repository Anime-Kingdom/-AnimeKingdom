import fs from 'node:fs';
const source=fs.readFileSync('C:/Users/vishisht/.codex/attachments/ff4e6a4e-cbf6-4108-b1e6-b3daf6a212d6/pasted-text.txt','utf8');
const css=source.match(/<style>([\s\S]*?)<\/style>/)[1];
const asset=(p,m)=>'data:'+m+';base64,'+fs.readFileSync(p).toString('base64');
const assets={logo:asset('public/logo.jpeg','image/jpeg'),hero:asset('public/hero.webp','image/webp'),spider:asset('public/reference-1.webp','image/webp'),custom:asset('public/reference-2.webp','image/webp'),hulk:asset('public/reference-3.webp','image/webp'),gojo:asset('public/reference-4.webp','image/webp')};
const head=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Anime Kingdom | Anime Figures & 3D Collectibles</title><meta name="description" content="Discover Anime Kingdom: anime figures, character collectibles and custom 3D figure concepts."><meta name="theme-color" content="#09040f"><style>${css}\n`;
fs.writeFileSync('work/export-head.txt',head);fs.writeFileSync('work/export-assets.json',JSON.stringify(assets));
