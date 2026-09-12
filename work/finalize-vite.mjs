import fs from 'node:fs';
const path='public/storefront/app.js';const js=fs.readFileSync(path,'utf8');fs.writeFileSync(path,js.replace(/^const ASSETS=.*?;\n/,'const ASSETS='+fs.readFileSync('work/export-assets.json','utf8')+';\n'));
const test=fs.readFileSync('work/supabase/test-connection.mjs','utf8').replace("const script=html.match(/<script>([\\s\\S]*?)<\\/script>/)[1];","const script=fs.readFileSync('public/storefront/app.js','utf8');");fs.writeFileSync('work/test-vite.mjs',test);
const p='work/convert-vite.mjs';let s=fs.readFileSync(p,'utf8');s=s.replace('JSON.stringify(urls)','JSON.stringify(assets)');s=s.slice(0,s.indexOf("fs.copyFileSync('vite.config.ts'"))+"console.log('Updated Vite storefront from HTML source.');\n";fs.writeFileSync(p,s);
