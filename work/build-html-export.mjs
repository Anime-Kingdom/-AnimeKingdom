import fs from 'node:fs';
import vm from 'node:vm';
const js=['work/export-core.js','work/export-pages.js','work/export-editor.js','work/export-supabase.js','work/export-motion.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');
new vm.Script(js,{filename:'anime-kingdom.js'});
const assets=fs.readFileSync('work/export-assets.json','utf8');
const html=fs.readFileSync('work/export-head.txt','utf8')+fs.readFileSync('work/export-layout.txt','utf8').replace('</style>','\n'+fs.readFileSync('work/export-motion.css','utf8')+'\n</style>')+'\nconst ASSETS='+assets+';\n'+js+'\n</script></body></html>';
if(/src=["']https:\/\/images\.unsplash/.test(html))throw Error('Unexpected external photo');
fs.writeFileSync('outputs/anime-kingdom.html',html);
console.log('JavaScript syntax verified. Self-contained HTML saved:',Buffer.byteLength(html),'bytes.');
