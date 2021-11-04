const fsp = require('fs').promises;
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const GIFEncoder = require('gifencoder');
const svg2img = promisify(require("svg2img"));
const { Readable } = require('stream');

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
async function saveAnimation(data) {
    try {
    // Generate a unique filename
    const filename = uuid.v1();

    // Generate a file path for this (normalize takes out the ..)
    const pathname = path.normalize( path.join(__dirname, '../public/assets', filename) ) ;
    console.log(pathname);
    await saveFile(pathname + ".txt", data);
    await createGif(pathname + ".gif", data);
    } catch (err) {
        throw err;
    }
}

async function deleteFile(path) {
    return fsp.unlink(path, ()=>{});
}

async function createGif(path, animationData) {
    const svgs = animationData.split(',');
    const width = 800;
    const height = 800;
    const encoder = new GIFEncoder(width, height);

    // stream the results as they are available into myanimated.gif
    const writeStream = fs.createWriteStream(path);
    const readStream = encoder.createReadStream();
    readStream.pipe( writeStream );

    encoder.start();
    encoder.setRepeat(0);
    // encoder.setDelay(animation.playbackSpeed);
    
    const imageBuffers = [];
    for(const svg of svgs) {
        console.log('converting svg...');
        const buffer = await svg2img(`<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">` + svg);
        console.log(buffer);
        fs.writeFileSync('./test.png', buffer);
        const stream = Readable.from(buffer);
        encoder.addFrame(stream);
    }

    encoder.finish();
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
