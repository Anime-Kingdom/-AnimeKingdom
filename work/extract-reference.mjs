import fs from 'node:fs';
import {createRequire} from 'node:module';const require=createRequire(import.meta.url);const sharp=require('C:/Users/vishisht/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const html=fs.readFileSync('work/reference-store.html','utf8');const matches=[...html.matchAll(/<img[^>]+src="(data:image\/(?:jpeg|png);base64,[^"]+)"[^>]*>/g)];const images=[...new Set(matches.map(m=>m[1]))];
for(let i=0;i<images.length;i++){const b=Buffer.from(images[i].split(',')[1],'base64');await sharp(b).resize({width:1100,withoutEnlargement:true}).webp({quality:85}).toFile('public/reference-'+(i+1)+'.webp');console.log(i+1,(await sharp(b).metadata()).width,(await sharp(b).metadata()).height)}
console.log('Assets extracted:',images.length);
