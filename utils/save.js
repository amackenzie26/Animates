const fsp = require('fs').promises;
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const pngFileStream = require('png-file-stream');
const GIFEncoder = require('gifencoder');
const svg2img = promisify(require("svg2img"));



async function saveFile(pathname, data) {
    try {
        fsp.writeFile(pathname, data, 'utf-8');
        return true;
    } catch (err) {
        throw err;
    }
}

async function openFile(path) {
    try {
        // console.log(path);
        return await fsp.readFile(path, 'utf-8'); 
        // console.log(data);
        // return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

// Generates a unique name
async function saveAnimation(data, playbackSpeed, width, height) {
    try {

    // Heroku fix
    const animationsDir = path.normalize(path.join(__dirname, '../public/assets/animations'));
    if(!fs.existsSync(animationsDir)) fs.mkdirSync(animationsDir);
    // Generate a unique filename
    const dirname = uuid.v1();

    // Generate a file path for this (normalize takes out the ..)
    const fullPathname = path.normalize( path.join(__dirname, '../public/assets/animations', dirname) ) ;
    const pathname = path.join('/assets/animations/', dirname);
    // console.log(pathname);
    if(!fs.existsSync(fullPathname)) fs.mkdirSync(fullPathname);
    await saveFile(fullPathname + "/data.txt", data);
    await createGif(fullPathname, data, playbackSpeed, width, height);
    return pathname;
    } catch (err) {
        console.log(err);
    }
}

async function deleteFile(path) {
    return fsp.unlink(path, ()=>{});
}

async function createGif(path, animationData, playbackSpeed, width, height) {
    const svgs = animationData.split(',');
    const encoder = new GIFEncoder(width, height);
    

    // // stream the results as they are available into myanimated.gif
    // const writeStream = fs.createWriteStream(path);
    // const readStream = encoder.createReadStream();
    // readStream.pipe( writeStream );

    // encoder.start();
    // encoder.setRepeat(0);
    // encoder.setDelay(animation.playbackSpeed);
    
    const imageBuffers = [];
    const imagePaths = [];
    for(let i=0; i<svgs.length; i++) {
        const buffer = await svg2img(`<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">` + svgs[i]);
        await fsp.writeFile(path + "/frame" + i + ".png", buffer);
        imageBuffers.push(buffer);
        imagePaths.push(path + "/frame" + i + ".png");
    }
    console.log('creating stream...')
    try {
    const stream = pngFileStream( path + '/frame?.png')
    .pipe(encoder.createWriteStream({ repeat: 0, delay: playbackSpeed, quality: 10, transparent: true }))
    .pipe(fs.createWriteStream(path + '/animation.gif'));
    } catch (err) {
        console.log(err);
    }

}

function promisify(f) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            function callback(err, result) {
                err ? reject(err) : resolve(result);
            }

            args.push(callback);
            f.call(this, ...args);
        });
    }
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
