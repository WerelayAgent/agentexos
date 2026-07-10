const fs = require('fs');
const path = require('path');

function fixContent(c) {
    // Fix Agentexosos -> Agentexos
    c = c.replace(/Agentexosos/g, 'Agentexos');
    c = c.replace(/AGENTEXOSOS/g, 'AGENTEXOS');
    c = c.replace(/agentexosos/g, 'agentexos');

    // Fix /_next/image?url=...
    // E.g. /_next/image?url=%2Fimages%2Flogo.png&w=96&q=75 -> /images/logo.png
    c = c.replace(/\/_next\/image\?url=([^&"']+)[^"']*/g, (match, urlParam) => {
        return decodeURIComponent(urlParam);
    });

    return c;
}

const filesToProcess = ['index.html'];
const chunksDir = 'public/_next/static/chunks';
fs.readdirSync(chunksDir).forEach(f => {
    if (f.endsWith('.js')) {
        filesToProcess.push(path.join(chunksDir, f));
    }
});

filesToProcess.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    let fixed = fixContent(c);
    if (c !== fixed) {
        fs.writeFileSync(f, fixed);
        console.log('Fixed', f);
    }
});
