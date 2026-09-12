import fs from 'node:fs';
for (const file of ['work/export-layout.txt','work/export-core.js','work/export-pages.js']) {
 let s=fs.readFileSync(file,'utf8');
 s=s.replace(/<div class="demo-note">HTML DEMO[^<]*<\/div>/g,'')
 .replace(/<button[^>]*onclick="openModel\(\)"[^>]*>[\s\S]*?<\/button>/g,'')
 .replace(/<li><a data-view="track"[^>]*>[^<]*<\/a><\/li>/g,'')
 .replace('<span>Standalone HTML demo · ₹ INR</span>','')
 .replace("['track','Track Order','▱'],",'')
 .replace(/^function openModel\(.*\r?\n/gm,'')
 .replace(/^async function loadModel\(.*\r?\n/gm,'')
 .replace(/^function trackOrder\(.*\r?\n/gm,'')
 .replace(/case 'track':[\s\S]*?(?=case 'drops':)/g,'')
 .replace("['How does 3D work?','Load a GLB model you own. Rotation and zoom work after the optional online viewer library loads.'],",'')
 .replace("['Where is my order?','Track Demo Order searches orders saved in this browser only.'],",'')
 .replace(' The optional 3D viewer downloads its library from unpkg.com; selected models remain local.','')
 .replace('A 3D walk-through requires a supplied scene model. Explore this accessible 2D showroom.','Explore the Anime Kingdom showroom and discover your next collectible.');
 fs.writeFileSync(file,s);
}
