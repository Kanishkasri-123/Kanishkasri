const fs = require('fs');
const path = require('path');

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory() && f !== 'node_modules') {
            checkDir(p);
        } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
            const content = fs.readFileSync(p, 'utf8');
            const matches = content.match(/from\s+['"](.*?)['"]/g) || [];
            
            for (const m of matches) {
                const imp = m.replace(/from\s+['"]|['"]/g, '');
                if (imp.startsWith('.')) {
                    const targetName = path.basename(imp);
                    const targetDir = path.dirname(path.resolve(path.dirname(p), imp));
                    
                    if (fs.existsSync(targetDir)) {
                        const actualFiles = fs.readdirSync(targetDir);
                        const matchOpts = [targetName, targetName + '.js', targetName + '.jsx', targetName + '/index.js', targetName + '/index.jsx'];
                        const actual = actualFiles.find(name => {
                            if (matchOpts.includes(name)) return true;
                            // check case-insensitive match
                            if (name.toLowerCase() === targetName.toLowerCase() + '.js') return true;
                            if (name.toLowerCase() === targetName.toLowerCase() + '.jsx') return true;
                            return false;
                        });
                        
                        if (actual && !matchOpts.includes(actual)) {
                            console.log(`Case mismatch in ${p}: imported '${imp}' but actual file is '${actual}'`);
                        }
                    }
                }
            }
        }
    }
}

checkDir(path.join(__dirname, 'src'));
console.log('Check complete.');
