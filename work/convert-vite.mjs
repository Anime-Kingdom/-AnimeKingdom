import {createHash} from 'node:crypto';
import fs from 'node:fs';
import sharp from 'sharp';
const html=fs.readFileSync('outputs/anime-kingdom.html','utf8');
fs.mkdirSync('src',{recursive:true});fs.mkdirSync('public/storefront',{recursive:true});
const assets=JSON.parse(fs.readFileSync('work/export-assets.json','utf8'));const urls={};
for(const [name,data] of Object.entries(assets)){
 const m=data.match(/^data:([^;]+);base64,(.*)$/s);if(!m)throw Error('Invalid asset '+name);
 let bytes=Buffer.from(m[2],'base64');let ext='svg';
 if(m[1]!=='image/svg+xml'){bytes=await sharp(bytes).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();ext='webp';}
 const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
 const file=name+'-'+hash+'.'+ext;fs.writeFileSync('public/storefront/'+file,bytes);urls[name]='./storefront/'+file;
 if(ext==='webp'){const thumb=await sharp(bytes).resize({width:480,height:640,fit:'inside',withoutEnlargement:true}).webp({quality:76}).toBuffer();const th=createHash('sha256').update(thumb).digest('hex').slice(0,12);const tf=name+'-thumb-'+th+'.webp';fs.writeFileSync('public/storefront/'+tf,thumb);urls[name+'Thumb']='./storefront/'+tf;}
}

let css=[];let output=html.replace(/<script>([\s\S]*?)<\/script>/,()=>'<script src="./storefront/app.js" defer></script>');
output=output.replace(/<style[^>]*>([\s\S]*?)<\/style>/g,(_,s)=>{css.push(s);return ''});
output=output.replace(/<img([^>]*?)data-asset="([^"]+)"([^>]*?)>/g,(tag,before,key,after)=>'<img'+before+'data-asset="'+key+'" src="'+urls[key]+'" decoding="async"'+after+'>');
output=output.replace('</head>','<link rel="stylesheet" href="/src/style.css"><link rel="stylesheet" href="./product-photos.css?v=2">\n\n</head>');
fs.writeFileSync('index.html',output);fs.writeFileSync('src/style.css',css.join('\n'));
const js=['work/export-core.js','work/export-pages.js','work/export-editor.js','work/export-supabase.js','work/export-motion.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');
fs.writeFileSync('public/storefront/app.js','const ASSETS='+JSON.stringify(urls)+';\n'+js);
// A content-addressed script prevents a cached catalog from being paired with new HTML.
const app=fs.readFileSync('public/storefront/app.js');
const version=createHash('sha256').update(app).digest('hex').slice(0,16);
const filename='app-'+version+'.js';
fs.writeFileSync('public/storefront/'+filename,app);
fs.writeFileSync('index.html',output.replace('./storefront/app.js','./storefront/'+filename).replace('</body>','<script src="./storefront/live-catalog.js" defer></script><script src="./product-photos.js?v=1" defer></script></body>'));
console.log('Updated Vite storefront with versioned script: '+filename);
// Preserve crawlable SEO entry points and social metadata when exporting.
if(fs.existsSync('public/seo-pages.json')){
 const pages=JSON.parse(fs.readFileSync('public/seo-pages.json','utf8'));
 const c=pages.home,esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 let entry=fs.readFileSync('index.html','utf8').replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(c.title)+'</title>').replace(/<meta name="description"[^>]*>/,'<meta name="description" content="'+esc(c.description)+'">');
 const tags=Object.entries({'og:type':'website','og:site_name':'Anime Kingdom','og:title':c.title,'og:description':c.description,'og:url':'https://animekingdom.in/','og:image':c.image}).map(([k,v])=>'<meta property="'+k+'" content="'+esc(v)+'">').join('')+'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="'+esc(c.image)+'">';
 entry=entry.replace('</head>',tags+'</head>').replace('</body>','<script src="/seo-navigation.js?v=1" defer></script></body>').replace(/href="#([a-z]+)"/g,(all,v)=>pages[v]?'href="'+pages[v].path+'"':all);
 fs.writeFileSync('index.html',entry);
}
