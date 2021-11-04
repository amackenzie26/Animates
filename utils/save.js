const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

async function saveFile(pathname, data) {
    try {
        fs.writeFile(pathname, data, ()=>{});
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function openFile(path) {
    try {
        const data = await fs.openFile(path, ()=>{}); 
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

// Generates a unique name
async function saveAnimation(data) {
    // Generate a unique filename
    const filename = uuid.v1() + ".json";

    // Generate a file path for this (normalize takes out the ..)
    const pathname = path.normalize( path.join(__dirname, '../public/assets', filename) ) ;
    console.log(pathname);
    if(await saveFile(pathname, data)) {
        return pathname;
    } else {
        throw Error('Failed to save animation!');
    }
}

async function deleteFile(path) {
    return fs.unlink(path, ()=>{});
}

module.exports = {
    openFile,
    saveAnimation,
    saveFile,
    deleteFile
}

// saveAnimation("hi ho, hi ho, it's off to work we go")
//     .then(pathname => saveFile(pathname, 'ho hi, ho hi, off its work to go we'))
//     .then(response => console.log(response));
