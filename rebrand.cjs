const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (f === '.git' || f === 'node_modules') return;
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedFiles = 0;

walkDir('.', (filePath) => {
    const ext = path.extname(filePath);
    if (!['.html', '.js', '.json', '.txt', '.css'].includes(ext)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Simple text replacements
    content = content.replace(/\bBSC\b/g, 'Robinhood Chain');
    content = content.replace(/four\.meme/g, 'Pons Family');
    content = content.replace(/fourmeme/gi, 'ponsfamily');
    // Replace BNB with ETH (since Robinhood Chain uses ETH as gas)
    content = content.replace(/\bBNB\b/g, 'ETH');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        modifiedFiles++;
    }
});

console.log(`Rebranding complete! Modified ${modifiedFiles} files.`);
