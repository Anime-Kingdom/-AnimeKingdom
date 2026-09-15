import {createHash} from 'node:crypto';
import fs from 'node:fs';
const html=fs.readFileSync('outputs/anime-kingdom.html','utf8');
fs.mkdirSync('src',{recursive:true});fs.mkdirSync('public/storefront',{recursive:true});
const assets=JSON.parse(fs.readFileSync('work/export-assets.json','utf8'));const urls={};
for(const [name,data] of Object.entries(assets)){const m=data.match(/^data:([^;]+);base64,(.*)$/s);if(!m)throw Error('Invalid asset '+name);const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/svg+xml':'svg'}[m[1]];if(!ext)throw Error(m[1]);fs.writeFileSync('public/storefront/'+name+'.'+ext,Buffer.from(m[2],'base64'));urls[name]='./storefront/'+name+'.'+ext;}
let css=[];let output=html.replace(/<script>([\s\S]*?)<\/script>/,()=>'<script src="./storefront/app.js" defer></script>');
output=output.replace(/<style[^>]*>([\s\S]*?)<\/style>/g,(_,s)=>{css.push(s);return ''});
output=output.replace('</head>','<link rel="stylesheet" href="/src/style.css">\n</head>');
fs.writeFileSync('index.html',output);fs.writeFileSync('src/style.css',css.join('\n'));
const js=['work/export-core.js','work/export-pages.js','work/export-editor.js','work/export-supabase.js','work/export-motion.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');
fs.writeFileSync('public/storefront/app.js','const ASSETS='+JSON.stringify(assets)+';\n'+js);
// A content-addressed script prevents a cached catalog from being paired with new HTML.
const app=fs.readFileSync('public/storefront/app.js');
const version=createHash('sha256').update(app).digest('hex').slice(0,16);
const filename='app-'+version+'.js';
for(const file of fs.readdirSync('public/storefront'))if(/^app-[a-f0-9]{16}\.js$/.test(file)&&file!==filename)fs.unlinkSync('public/storefront/'+file);
fs.writeFileSync('public/storefront/'+filename,app);
fs.writeFileSync('index.html',output.replace('./storefront/app.js','./storefront/'+filename));
console.log('Updated Vite storefront with versioned script: '+filename);
