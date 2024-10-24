const fs = require('fs').promises;
const path = require('path');

const programFilesDirs = [
    '/mnt/c/Program Files',
    '/mnt/c/Program Files (x86)',
];

module.exports = {
    getInstalledApps: getInstalledApps
};
async function listFilesRecursively(dir, fileList = [], depth = 0, maxDepth = 3) {
    try {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            try {
                const fileStat = await fs.stat(filePath);
                if (fileStat.isDirectory() && depth < maxDepth) {
                    await listFilesRecursively(filePath, fileList, depth + 1, maxDepth);
                } else if (file.endsWith('.exe')) {
                    fileList.push(filePath);
                }
            } catch (err) {
                if (err.code === 'EACCES') {
                    console.warn(`Permission denied for directory: ${filePath}`);
                }
            }
        }
    } catch (err) {
        if (err.code === 'EACCES') {
            console.warn(`Permission denied for directory: ${dir}`);
        }
    }

    return fileList;
}


async function getInstalledApps() {
    let apps = [];
    for (const dir of programFilesDirs) {
        if (await fs.access(dir).then(() => true).catch(() => false)) {
            const exeFiles = await listFilesRecursively(dir);
            apps = apps.concat(exeFiles);
        }
    }
    return apps;
}

