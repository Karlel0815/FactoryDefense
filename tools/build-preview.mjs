// One-file preview: bundle small ES modules without an external dependency.
// Each module receives its own scope to prevent colliding constant names.
import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const order=['grid','network','economy','model','combat','game'];
const bundles=[];
for(const name of order){
 const source=read(`src/${name}.js`);
 const exports=[...source.matchAll(/\bexport\s+(?:const|let|function|class)\s+(\w+)/g)].map(v=>v[1]);
 let js=source.replace(/import\s*\{([^}]*)\}\s*from\s*['"]\.\/([\w-]+)\.js['"];?/g,(_,imported,moduleName)=>{
   const names=imported.split(',').map(x=>x.trim()).filter(Boolean).join(',');
   return `const { ${names} } = __modules.${moduleName};`;
 });
 js=js.replace(/\bexport\s+(?=(?:const|let|function|class)\b)/g,'');
 bundles.push(`{\n${js}\n${exports.length?`__modules.${name}={ ${exports.join(',')} };`:''}\n}`);
}
const html=read('index.html'),css=read('src/style.css');
const combined=`const __modules={};\n${bundles.join('\n')}`;
const preview=html.replace('<link rel="stylesheet" href="src/style.css"/>',`<style>${css}</style>`).replace('<script type="module" src="src/game.js"></script>',`<script type="module">\n${combined}\n</script>`);
if(preview.includes('src="src/game.js"')||preview.includes('href="src/style.css"')||preview.includes('import {'))throw Error('Preview bundling failed');
writeFileSync(new URL('../preview.html',import.meta.url),preview);
console.log('Standalone HTML generated:',preview.length,'bytes');
