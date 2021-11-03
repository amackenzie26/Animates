const fs = require('fs');
const uuid = require('uuid');

async function saveFile(path, data) {
    try {
        fs.writeFile(path, data);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function openFile(path) {
    try {
        const data = await fs.openFile(path); 
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

// Generates a unique name
async function saveAnimation(data) {
    // Generate a unique filename
    const filename = uuid.v1();

    // Generate a file path for this (normalize takes out the ..)
    const path = path.normalize( path.join(__dirname, '../public/assets') );
    if(await saveFile(path, data)) {
        return path;
    } else {
        throw Error('Failed to save animation!');
    }
}

module.exports = {
    openFile,
    saveAnimation,
    saveFile
}