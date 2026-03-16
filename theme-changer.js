const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\\\Users\\\\Asus\\\\OneDrive\\\\Desktop\\\\mini\\\\frontend\\\\src';

const replacements = [
  [/bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/g, 'bg-white'],
  [/\bbg-slate-950\/60\b/g, 'bg-white/80'],
  [/\bbg-slate-950\b/g, 'bg-white'],
  [/\bbg-slate-900\/70\b/g, 'bg-slate-100'],
  [/\bbg-slate-900\b/g, 'bg-white'],
  [/\bbg-slate-800\b/g, 'bg-slate-50'],
  [/\bborder-slate-800\b/g, 'border-slate-200'],
  [/\bborder-slate-700\b/g, 'border-slate-300'],
  [/\btext-slate-50\b/g, 'text-slate-900'],
  [/\btext-slate-100\b/g, 'text-slate-900'],
  [/\btext-slate-200\b/g, 'text-slate-800'],
  [/\btext-slate-300\b/g, 'text-slate-700'],
  [/\btext-slate-400\b/g, 'text-slate-600'],
  [/\bshadow-slate-950\/40\b/g, 'shadow-slate-200/40'],
  [/\bring-offset-slate-950\b/g, 'ring-offset-white'],
  [/\bbg-red-950\/40\b/g, 'bg-red-50'],
  [/\bborder-red-500\/60\b/g, 'border-red-300'],
  [/\btext-red-200\b/g, 'text-red-700']
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  for (const [regex, replacement] of replacements) {
    newContent = newContent.replace(regex, replacement);
  }
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});

console.log('Done');
