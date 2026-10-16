// Build a portable standalone HTML preview. The normal game uses ES modules.
import { readFileSync, writeFileSync } from 'node:fs';
const root=new URL('../',import.meta.url);
const read = p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html');
const css=read('src/style.css');
const names=['src/grid.js','src/network.js','src/economy.js','src/model.js','src/game.js'];
const js=names.map(name=>read(name).replace(/^import\s+.*?;\s*$/gm,'').replace(/^export\s+/gm,'')).join('\n\n');
const preview=html.replace('<link rel="stylesheet" href="src/style.css" />',`<style>${css}</style>`).replace('<script type="module" src="src/game.js"></script>',`<script type="module">\n${js}\n</script>`);
if(preview.includes('src="src/game.js"')||preview.includes('href="src/style.css"'))throw Error('Preview inlining failed');
writeFileSync(new URL('../preview.html',import.meta.url),preview);
console.log('Preview written: preview.html');
