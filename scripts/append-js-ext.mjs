import fs from 'fs/promises';
import path from 'path';

const distDir = path.resolve('dist');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && full.endsWith('.js')) await fixFile(full);
  }
}

async function fixFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');

  // Replace import/export statements that use relative paths without extension
  // Matches: import ... from './something' or export ... from './something'
  const re = /(\b(?:import|export)[\s\S]*?\s+from\s+)(['"])(\.[^'"\n]+?)\2/g;

  content = content.replace(re, (match, p1, quote, relPath) => {
    // Only handle relative paths (start with '.') and do not already have an extension
    if (!relPath.startsWith('.')) return match;
    if (/\.(js|json|node)$/.test(relPath)) return match;
    return `${p1}${quote}${relPath}.js${quote}`;
  });

  await fs.writeFile(filePath, content, 'utf8');
}

(async () => {
  try {
    await walk(distDir);
    console.log('✅ Appended .js extensions to relative imports in dist files');
  } catch (err) {
    console.error('Failed to append .js extensions:', err);
    process.exit(1);
  }
})();
